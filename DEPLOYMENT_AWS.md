## EduHaven – AWS deployment (100% free‑tier friendly, no WebSocket, no DynamoDB/Cognito)

This guide deploys the app to AWS on free‑tier components only and intentionally avoids WebSockets, DynamoDB, Cognito, Nginx, and ALB.

Stack we’ll use:
- Frontend (Client): S3 static hosting via CloudFront (free tier)
- Backend (Server): Node.js/Express on a single EC2 t2.micro (750 hrs free/month)
- Database: MongoDB Atlas (free tier)
- Auth: Existing JWT logic in this repo (no Cognito)
- Email: Resend (already integrated) or skip

Result: one CloudFront distribution (or your custom domain) that serves the SPA from S3 and forwards only REST API calls to your EC2 instance. No WebSocket routes are created.

---

## 1) MongoDB Atlas setup

1. Create a free tier cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user (username/password) with read/write.
3. Network access:
   - Quick start: Allow your IP and your EC2 instance IP (or temporarily 0.0.0.0/0 then tighten).
   - Better: Configure AWS PrivateLink/peering for private connectivity (optional; paid tiers).
4. Get your connection string (driver: Node.js). It looks like:

   mongodb+srv://<user>:<pass>@<cluster-url>/?retryWrites=true&w=majority&appName=EduHaven

5. In the EC2 instance, set the env variables below (see “Server env”). The Server already connects via `Server/Database/Db.js` using Mongoose.

Key notes:
- Keep the SRV string intact; do not append the DB name to the path if you use `MONGODB_DBNAME` env (the app sets it via options).
- Atlas IP access must allow the EC2 egress IP (public IP or NAT IP).

---

## 2) Server (Node/Express) on EC2 (no Nginx/ALB)

Prereqs: An AWS account, a key pair, and a default VPC.

1. Launch EC2
   - AMI: Amazon Linux 2023 (x86_64)
   - Instance type: t2.micro (free tier)
   - Security group inbound: 22 (SSH), 8080 (HTTP for API)
   - Note: CloudFront supports a limited set of origin ports; 8080 is allowed. We’ll run Node on 8080 to stay simple and free (no ALB/Nginx).

2. Install runtime on the instance
   - Update packages and install Node LTS, git, and PM2.
   - We won’t install Nginx or any load balancer to keep it free.

   Step-by-step (connect and install):

   From your Windows PC (PowerShell):

   ```powershell
   # (Optional) tighten key permissions on Windows so SSH accepts the .pem
   # Replace the path with your actual .pem file
   icacls "C:\path\to\your-key.pem" /inheritance:r
   icacls "C:\path\to\your-key.pem" /grant:r "$($env:USERNAME):(R)"

   # Connect (replace with your instance public DNS/IP)
   ssh -i C:\path\to\your-key.pem ec2-user@<EC2_PUBLIC_DNS_OR_IP>
   ```

   On the EC2 instance (Amazon Linux 2023):

   ```bash
   # Update OS packages
   sudo dnf -y update

   # Install Node.js (includes npm) and git
   sudo dnf -y install nodejs git

   # Verify versions
   node -v
   npm -v

   # Install PM2 globally
   sudo npm install -g pm2
   pm2 -v
   ```

3. Deploy the code
   - Clone the repo to /opt/eduhaven (or similar), install server deps.
   - Create the production env file at `Server/.env` (see sample below). Set `PORT=8080`.
   - Start with PM2 and enable startup on reboot.

   Step-by-step (deploy/start):

   ```bash
   # Create app directory and give ownership to ec2-user
   sudo mkdir -p /opt/eduhaven
   sudo chown ec2-user:ec2-user /opt/eduhaven
   cd /opt/eduhaven

   # Clone your repo (replace with your Git URL if different)
   git clone https://github.com/Dhanush-S14/aws_cloud.git .

   # Install server dependencies
   cd Server
   npm ci || npm install

   # Create your production environment file
   cat > .env << 'EOF'
   NODE_ENV=production
   PORT=8080
   
   # Frontend origin (your CloudFront or custom domain)
   CORS_ORIGIN=https://app.yourdomain.com
   
   # MongoDB Atlas (URL-encode password if it has special characters)
   MONGODB_URI=mongodb+srv://<user>:<ENCODED_PASS>@<cluster-url>/?retryWrites=true&w=majority&appName=eduHaven
   MONGODB_DBNAME=eduhaven
   
   # JWT/auth
   JWT_SECRET=change_me
   TOKEN_EXPIRY=1d
   REFRESH_TOKEN_EXPIRY=7d
   Activation_Secret=change_me_too
   
   # Email (Resend) — optional
   RESEND_KEY=your_resend_key
   
   # Socket rate limits (optional overrides)
   SOCKET_MESSAGE_LIMIT=10
   SOCKET_ROOM_LIMIT=5
   SOCKET_TYPING_LIMIT=20
   EOF

   # Quick smoke test that the app can read env and start via PM2
   pm2 start index.js --name eduhaven-api
   pm2 save
   pm2 startup   # Follow the one-time instruction it prints (sudo command)

   # Verify it’s listening and healthy (Health route = /uptime)
   curl -s http://localhost:8080/uptime
   ```

   Update/redeploy later:

   ```bash
   cd /opt/eduhaven
   git pull --rebase
   cd Server
   npm ci || npm install
   pm2 reload eduhaven-api
   ```

4. Logs/monitoring
   - Use `pm2 logs` for quick checks.
   - Optional: Install the CloudWatch Agent to ship `/var/log/nginx/*.log` and PM2 logs to CloudWatch.

5. SSL and domain for the API
   - We won’t use ALB or Nginx. CloudFront will talk to the EC2 origin over HTTP:8080. From users to CloudFront, traffic is HTTPS.
   - If you need end‑to‑end TLS, you’d need ALB or Nginx with certs, which can add cost—so we skip it for the free‑tier goal.

Server env (create `Server/.env` on the instance):

```
NODE_ENV=production
PORT=8080

# Frontend origin (your CloudFront or custom domain)
CORS_ORIGIN=https://app.yourdomain.com

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster-url>/?retryWrites=true&w=majority&appName=EduHaven
MONGODB_DBNAME=eduhaven

# JWT/auth
JWT_SECRET=change_me
TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d
Activation_Secret=change_me_too

# Email (Resend)
RESEND_KEY=your_resend_key

# Socket rate limits (optional overrides)
SOCKET_MESSAGE_LIMIT=10
SOCKET_ROOM_LIMIT=5
SOCKET_TYPING_LIMIT=20
```

Start the server with PM2 (listening on 8080):

```
cd /opt/eduhaven/Server
npm ci
PORT=8080 pm2 start index.js --name eduhaven-api
pm2 save
pm2 startup  # follow the printed command once
```

WebSockets: Not used. No special proxying is configured.

---

## 3) Frontend (Client) on S3 + CloudFront

1. Build locally (or in CI):

```
cd Client
npm ci
npm run build
```

2. S3 bucket
   - Create an S3 bucket (e.g., `app-yourdomain-com`) in a region close to you.
   - Block all public access (enabled).
   - Don’t enable S3 static website hosting; CloudFront will access the bucket privately.
   - Upload the contents of `Client/dist/`.

3. CloudFront distribution
   - Origin 1 (S3): your S3 bucket with Origin Access Control (OAC). Default root `index.html`.
   - Origin 2 (EC2): your instance’s public DNS or public IP on port 8080. Protocol: HTTP only.
   - Behaviors:
     - Default → S3
     - `/api/*` → EC2 origin (forward all headers and query strings; allow GET,HEAD,OPTIONS,PUT,POST,PATCH,DELETE)
   - SPA routing: custom error response mapping 403/404 to `/index.html` with 200 status.
   - Optional custom domain: Request an ACM cert in us‑east‑1 and attach to CloudFront; add Route 53 alias.

4. Route API traffic from CloudFront
   - Already covered via the EC2 origin and `/api/*` behavior above—no WebSocket route is created.

5. Client env
   - Set `VITE_API_URL` to the CloudFront path for API, e.g. `https://app.yourdomain.com/api`.
   - Rebuild and upload `Client/dist/` when this changes.

Cache invalidation: After uploading new builds, create a CloudFront invalidation for `/*` (or at least `index.html` and changed assets if you fingerprint filenames).

---

## 4) CORS and security

- Set `CORS_ORIGIN` on the server to your CloudFront (or custom) frontend domain. The server already reads and applies this.
- Use HTTPS everywhere.
- Rotate `JWT_SECRET` and `Activation_Secret` if leaked.
- In Atlas, restrict IP access to your ALB/EC2/NAT egress IPs only.

---

## Variant B (still free tier): API Gateway instead of direct EC2 origin (optional)

If you’d like API throttling/metrics without adding ALB:
1. Create an HTTP API in API Gateway (free‑tier: 1M req/month).
2. Integrate it with your EC2 public endpoint (HTTP 8080). This is simple but public; VPC Link/NLB is more private but not free.
3. Add an API Gateway origin in CloudFront and point `/api/*` to it.
4. Update `VITE_API_URL` if needed (still `https://app.yourdomain.com/api` if routed via CloudFront).

Note: We do not create any WebSocket APIs.

---

## 5) DNS and certificates

- Frontend: ACM certificate in us‑east‑1 for `app.yourdomain.com`, attach to CloudFront.
- Backend: none needed for free‑tier architecture (CloudFront → HTTP:8080 EC2). If you require TLS to the origin, you'll need ALB or Nginx + certs (not free).

---

## 6) Basic Monitoring: CPU Alerts and Security Auditing

This lightweight monitoring setup tracks EC2 CPU usage and AWS account activity (CloudTrail) to stay within free tier limits.

---

### 6.1) Set Up SNS for Email Alerts

**Create SNS Topic:**
1. Go to **AWS Console** → **SNS** → **Topics** → **Create topic**
2. Configure:
   - Type: **Standard**
   - Name: `EduHaven-Alerts`
   - Display name: `EduHaven Monitoring`
3. Click **Create topic**

**Create Email Subscription:**
1. In your topic, click **Create subscription**
2. Configure:
   - Protocol: **Email**
   - Endpoint: Your email address
3. Click **Create subscription**
4. **Check your email** and confirm the subscription

---

### 6.2) EC2 CPU Monitoring

**Create High CPU Alarm:**
1. Go to **CloudWatch** → **Alarms** → **Create alarm**
2. **Select metric** → **EC2** → **Per-Instance Metrics** → **CPUUtilization**
3. Select your instance
4. Configure:
   - Statistic: **Average**
   - Period: **5 minutes**
   - Threshold: Greater than **80** percent
5. Configure actions:
   - Alarm state: **In alarm**
   - SNS topic: `EduHaven-Alerts`
6. Alarm name: `EduHaven-HighCPU`
7. Click **Create alarm**

You'll receive an email when CPU usage exceeds 80% for 5 minutes.

---

### 6.3) Set Up CloudTrail (Security Auditing)

**Create CloudTrail Trail:**
1. Go to **CloudTrail** → **Trails** → **Create trail**
2. Configure:
   - Trail name: `EduHaven-Audit-Trail`
   - Storage location: **Create new S3 bucket**
   - S3 bucket name: `eduhaven-cloudtrail-logs-<random>`
3. **CloudWatch Logs**:
   - Enable CloudWatch Logs
   - Log group: `aws-cloudtrail-logs-eduhaven`
   - IAM role: Create new → `CloudTrail_CloudWatchLogs_Role`
4. Event type: **Management events** (Read + Write)
5. Click **Create trail**

**Create Alarm for Root Account Usage:**
1. Go to **CloudWatch** → **Logs** → **Log groups** → `aws-cloudtrail-logs-eduhaven`
2. **Actions** → **Create metric filter**
3. Filter pattern:
   ```
   { $.userIdentity.type = "Root" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != "AwsServiceEvent" }
   ```
4. Metric name: `RootAccountUsage`
5. Metric namespace: `CloudTrailMetrics`
6. Metric value: `1`
7. Click **Create metric filter**
8. Click **Create alarm** from the metric filter
9. Configure:
   - Threshold: Greater than **0** in 1 minute
   - SNS topic: `EduHaven-Alerts`
   - Alarm name: `EduHaven-RootAccountUsage`
10. Click **Create alarm**

You'll receive an email immediately if anyone logs in with the root account.

---

### 6.4) Test Your Setup

**Test SNS Notifications:**
1. Go to **SNS** → **Topics** → `EduHaven-Alerts`
2. Click **Publish message**
3. Subject: `Test Alert`, Message: `Testing notification`
4. Click **Publish** → Check your email

**View CloudTrail Logs:**
1. Go to **CloudTrail** → **Event history**
2. View recent AWS API calls and account activity

---

### 6.5) Cost Summary

**What's Free:**
- CloudWatch: 10 alarms, 5 GB log ingestion/month (first month), 5 GB storage
- CloudTrail: 1 trail with management events
- SNS: 1,000 email notifications/month

**Total Cost:** $0/month (within free tier limits)

---

## 7) What to change in this repo (summary)

- Client: set `VITE_API_URL` to your CloudFront `/api` path.
- Server: create `Server/.env` with your Atlas URI, secrets, and CORS origin.
- Optional: use `ops/nginx.conf.example` if you terminate TLS on EC2.

That’s it—no DynamoDB, no Cognito. You’re using Atlas + JWT (already implemented) and a standard S3/CloudFront + EC2 stack.
