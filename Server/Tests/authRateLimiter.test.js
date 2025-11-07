import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import {
  createLoginRateLimiter,
  createSignupRateLimiter,
} from "../Middlewares/ratelimit.middleware.js";

// Mock express request/response objects
const mockRequest = (ip, email = null, body = {}) => ({
  ip,
  body: { email, ...body },
  headers: {},
  app: {
    get: jest.fn().mockReturnValue(false), // Mock trust proxy setting
  },
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe("Login Rate Limiter - IP Isolation Tests", () => {
  let loginLimiter;

  beforeEach(() => {
    jest.clearAllMocks();
    // Create limiter with low limits for easier testing
    loginLimiter = createLoginRateLimiter({
      ipPoints: 3,
      ipDuration: 300, // 5 minutes
      userPoints: 2,
      userDuration: 900, // 15 minutes
    });
  });

  describe("IP-specific blocking", () => {
    it("should block only the specific IP that exceeded limits", async () => {
      const blockedIP = "192.168.1.100";
      const allowedIP = "192.168.1.101";

      // Exhaust rate limit for blocked IP
      for (let i = 0; i < 3; i++) {
        const req = mockRequest(blockedIP, `user${i}@example.com`);
        const res = mockResponse();
        await loginLimiter(req, res, mockNext);
      }

      // Next request from blocked IP should be rejected
      const blockedReq = mockRequest(blockedIP, "newuser@example.com");
      const blockedRes = mockResponse();
      await loginLimiter(blockedReq, blockedRes, mockNext);

      expect(blockedRes.status).toHaveBeenCalledWith(429);
      expect(blockedRes.json).toHaveBeenCalledWith({
        success: false,
        error: "Too many login attempts. Try again later.",
        retryAfter: expect.any(Number),
      });

      // Request from different IP should still work
      const allowedReq = mockRequest(allowedIP, "allowed@example.com");
      const allowedRes = mockResponse();
      await loginLimiter(allowedReq, allowedRes, mockNext);

      expect(allowedRes.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledTimes(4); // 3 successful + 1 from allowed IP
    });

    it("should allow multiple IPs to have independent rate limits", async () => {
      const ip1 = "10.0.0.1";
      const ip2 = "10.0.0.2";
      const ip3 = "10.0.0.3";

      // Each IP should be able to make 3 requests independently
      for (let i = 0; i < 3; i++) {
        // IP1 requests - use different users to avoid user limit
        await loginLimiter(
          mockRequest(ip1, `user${i}@ip1.com`),
          mockResponse(),
          mockNext
        );

        // IP2 requests
        await loginLimiter(
          mockRequest(ip2, `user${i}@ip2.com`),
          mockResponse(),
          mockNext
        );

        // IP3 requests
        await loginLimiter(
          mockRequest(ip3, `user${i}@ip3.com`),
          mockResponse(),
          mockNext
        );
      }

      expect(mockNext).toHaveBeenCalledTimes(9); // 3 IPs × 3 requests each

      // Now each IP should be at their limit - next request should fail
      const failedRes1 = mockResponse();
      const failedRes2 = mockResponse();
      const failedRes3 = mockResponse();

      await loginLimiter(
        mockRequest(ip1, "newuser1@ip1.com"),
        failedRes1,
        mockNext
      );
      await loginLimiter(
        mockRequest(ip2, "newuser2@ip2.com"),
        failedRes2,
        mockNext
      );
      await loginLimiter(
        mockRequest(ip3, "newuser3@ip3.com"),
        failedRes3,
        mockNext
      );

      expect(failedRes1.status).toHaveBeenCalledWith(429);
      expect(failedRes2.status).toHaveBeenCalledWith(429);
      expect(failedRes3.status).toHaveBeenCalledWith(429);
      expect(mockNext).toHaveBeenCalledTimes(9); // No additional successful calls
    });
  });

  describe("User-specific blocking with IP isolation", () => {
    it("should block user across IPs but not affect other users on same IP", async () => {
      // Use separate IP limits to test user blocking specifically
      const customLimiter = createLoginRateLimiter({
        ipPoints: 10, // High IP limit so we don't hit it
        ipDuration: 300,
        userPoints: 2, // User limit
        userDuration: 900,
      });

      const sharedIP = "172.16.0.1";
      const blockedUser = "blocked@example.com";
      const allowedUser = "allowed@example.com";

      // Exhaust user limit for blocked user from shared IP
      for (let i = 0; i < 2; i++) {
        await customLimiter(
          mockRequest(sharedIP, blockedUser),
          mockResponse(),
          mockNext
        );
      }

      // Next request from blocked user should fail (from same IP)
      const blockedRes1 = mockResponse();
      await customLimiter(
        mockRequest(sharedIP, blockedUser),
        blockedRes1,
        mockNext
      );
      expect(blockedRes1.status).toHaveBeenCalledWith(429);

      // Next request from blocked user should fail (from different IP)
      const blockedRes2 = mockResponse();
      await customLimiter(
        mockRequest("172.16.0.2", blockedUser),
        blockedRes2,
        mockNext
      );
      expect(blockedRes2.status).toHaveBeenCalledWith(429);

      // But allowed user from same IP should still work (IP limit not reached)
      const allowedRes = mockResponse();
      await customLimiter(
        mockRequest(sharedIP, allowedUser),
        allowedRes,
        mockNext
      );
      expect(allowedRes.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledTimes(3); // 2 initial + 1 allowed user
    });
  });

  describe("Mixed scenario testing", () => {
    it("should handle complex scenario with multiple IPs and users", async () => {
      // Create custom limiter with higher IP limits for this test
      const customLimiter = createLoginRateLimiter({
        ipPoints: 10, // High IP limit
        ipDuration: 300,
        userPoints: 2, // User limit
        userDuration: 900,
      });

      const scenario = [
        { ip: "192.168.1.10", user: "alice@test.com" },
        { ip: "192.168.1.11", user: "bob@test.com" },
        { ip: "192.168.1.12", user: "charlie@test.com" },
      ];

      // Each user makes 2 requests (user limit)
      for (const { ip, user } of scenario) {
        for (let i = 0; i < 2; i++) {
          await customLimiter(mockRequest(ip, user), mockResponse(), mockNext);
        }
      }

      expect(mockNext).toHaveBeenCalledTimes(6);

      // Alice hits user limit
      const aliceBlockedRes = mockResponse();
      await customLimiter(
        mockRequest("192.168.1.10", "alice@test.com"),
        aliceBlockedRes,
        mockNext
      );
      expect(aliceBlockedRes.status).toHaveBeenCalledWith(429);

      // Bob hits user limit
      const bobBlockedRes = mockResponse();
      await customLimiter(
        mockRequest("192.168.1.11", "bob@test.com"),
        bobBlockedRes,
        mockNext
      );
      expect(bobBlockedRes.status).toHaveBeenCalledWith(429);

      expect(mockNext).toHaveBeenCalledTimes(6); // No additional successful calls

      // New user from Alice's IP should still work (IP not exhausted)
      await customLimiter(
        mockRequest("192.168.1.10", "newuser@test.com"),
        mockResponse(),
        mockNext
      );

      expect(mockNext).toHaveBeenCalledTimes(7);
    });
  });

  describe("Edge cases", () => {
    it("should handle requests without email (IP limiting only)", async () => {
      const ip = "203.0.113.1";

      // Make 3 requests without email
      for (let i = 0; i < 3; i++) {
        await loginLimiter(mockRequest(ip), mockResponse(), mockNext);
      }

      expect(mockNext).toHaveBeenCalledTimes(3);

      // 4th request should be blocked
      const blockedRes = mockResponse();
      await loginLimiter(mockRequest(ip), blockedRes, mockNext);
      expect(blockedRes.status).toHaveBeenCalledWith(429);
    });

    it("should handle same user from different IPs hitting user limit", async () => {
      const user = "multiip@example.com";
      const ip1 = "198.51.100.1";
      const ip2 = "198.51.100.2";

      // User makes 1 request from IP1
      await loginLimiter(mockRequest(ip1, user), mockResponse(), mockNext);

      // User makes 1 request from IP2
      await loginLimiter(mockRequest(ip2, user), mockResponse(), mockNext);

      expect(mockNext).toHaveBeenCalledTimes(2);

      // 3rd request from either IP should be blocked (user limit = 2)
      const blockedRes1 = mockResponse();
      await loginLimiter(mockRequest(ip1, user), blockedRes1, mockNext);
      expect(blockedRes1.status).toHaveBeenCalledWith(429);

      const blockedRes2 = mockResponse();
      await loginLimiter(mockRequest(ip2, user), blockedRes2, mockNext);
      expect(blockedRes2.status).toHaveBeenCalledWith(429);

      // But other users from these IPs should still work
      await loginLimiter(
        mockRequest(ip1, "other1@example.com"),
        mockResponse(),
        mockNext
      );
      await loginLimiter(
        mockRequest(ip2, "other2@example.com"),
        mockResponse(),
        mockNext
      );

      expect(mockNext).toHaveBeenCalledTimes(4);
    });
  });
});

describe("Signup Rate Limiter - IP Isolation Tests", () => {
  it("should block signups from specific IP only", async () => {
    const blockedIP = "10.10.10.10";
    const allowedIP = "10.10.10.11";

    // Create a simple test using the actual express-rate-limit
    const testSignupLimiter = createSignupRateLimiter({
      windowMs: 60000,
      max: 2,
      standardHeaders: false,
      legacyHeaders: false,
      handler: (req, res) => {
        return res.status(429).json({
          success: false,
          error: "Too many signup attempts from this IP. Try again later.",
        });
      },
    });

    let successfulRequests = 0;

    // Make 2 successful requests from blocked IP
    for (let i = 0; i < 2; i++) {
      const req = mockRequest(blockedIP, `user${i}@example.com`);
      const res = mockResponse();

      await new Promise((resolve) => {
        testSignupLimiter(req, res, () => {
          successfulRequests++;
          resolve();
        });
      });
    }

    expect(successfulRequests).toBe(2);

    // Third request from blocked IP should be rate limited
    const blockedRes = mockResponse();
    let wasBlocked = false;

    await new Promise((resolve) => {
      const req = mockRequest(blockedIP, "blocked@example.com");
      testSignupLimiter(req, blockedRes, () => {
        // This should not be called if rate limited
        resolve();
      });

      // Check if rate limited (status method was called)
      setTimeout(() => {
        if (blockedRes.status.mock.calls.length > 0) {
          wasBlocked = true;
        }
        resolve();
      }, 10);
    });

    expect(wasBlocked).toBe(true);
    expect(blockedRes.status).toHaveBeenCalledWith(429);

    // But signup from different IP should still work
    const allowedRes = mockResponse();
    let allowedSuccess = false;

    await new Promise((resolve) => {
      const req = mockRequest(allowedIP, "allowed@example.com");
      testSignupLimiter(req, allowedRes, () => {
        allowedSuccess = true;
        resolve();
      });
    });

    expect(allowedSuccess).toBe(true);
    expect(allowedRes.status).not.toHaveBeenCalled();
  });
});

describe("Integration Tests", () => {
  it("should demonstrate complete IP isolation in realistic scenario", async () => {
    // Clear mock to ensure clean state
    mockNext.mockClear();

    const loginLimiter = createLoginRateLimiter({
      ipPoints: 3, // Allow 3 requests per IP
      ipDuration: 300,
      userPoints: 1, // Allow 1 request per user
      userDuration: 900,
    });

    // Scenario: Office with shared WiFi
    const officeIP = "192.168.0.100";
    const homeIP = "203.0.113.50";

    // Employee tries to login from office - succeeds (exhausts user limit)
    await loginLimiter(
      mockRequest(officeIP, "employee@company.com"),
      mockResponse(),
      mockNext
    );

    // Employee tries from home - should be blocked (user limit reached)
    const homeBlockedRes = mockResponse();
    await loginLimiter(
      mockRequest(homeIP, "employee@company.com"),
      homeBlockedRes,
      mockNext
    );
    expect(homeBlockedRes.status).toHaveBeenCalledWith(429);

    // But colleague from office should still be able to login
    await loginLimiter(
      mockRequest(officeIP, "colleague@company.com"),
      mockResponse(),
      mockNext
    );

    // And someone from home IP should also be able to login
    await loginLimiter(
      mockRequest(homeIP, "homeworker@company.com"),
      mockResponse(),
      mockNext
    );

    expect(mockNext).toHaveBeenCalledTimes(3); // employee(office) + colleague + homeworker

    // One more person can still login from office (3rd IP request)
    await loginLimiter(
      mockRequest(officeIP, "intern@company.com"),
      mockResponse(),
      mockNext
    );

    expect(mockNext).toHaveBeenCalledTimes(4);

    // Now office IP hits IP limit (3 successful requests)
    const officeBlockedRes = mockResponse();
    await loginLimiter(
      mockRequest(officeIP, "another@company.com"),
      officeBlockedRes,
      mockNext
    );
    expect(officeBlockedRes.status).toHaveBeenCalledWith(429);

    // But home IP should still work for more requests
    await loginLimiter(
      mockRequest(homeIP, "remote@company.com"),
      mockResponse(),
      mockNext
    );

    expect(mockNext).toHaveBeenCalledTimes(5);
  });
});

// Helper function to run load test
export const runLoadTest = async () => {
  console.log("Running load test...");

  const limiter = createLoginRateLimiter({
    ipPoints: 100,
    ipDuration: 60,
    userPoints: 50,
    userDuration: 300,
  });

  const results = {
    successful: 0,
    blocked: 0,
    errors: 0,
  };

  const promises = [];

  // Simulate 10 different IPs with 150 requests each
  for (let ip = 1; ip <= 10; ip++) {
    for (let req = 1; req <= 150; req++) {
      const promise = (async () => {
        try {
          const mockReq = mockRequest(
            `192.168.1.${ip}`,
            `user${req}@ip${ip}.com`
          );
          const mockRes = mockResponse();
          const mockNextFn = jest.fn();

          await limiter(mockReq, mockRes, mockNextFn);

          if (mockRes.status.mock?.calls?.length > 0) {
            results.blocked++;
          } else {
            results.successful++;
          }
        } catch (error) {
          results.errors++;
        }
      })();

      promises.push(promise);
    }
  }

  await Promise.all(promises);

  console.log("Load test results:", results);
  return results;
};
