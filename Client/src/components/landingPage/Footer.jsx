import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-transparent text-[var(--txt)] text-center py-4 text-sm">
      <p>
        © {new Date().getFullYear()} EduHaven ·{" "}
        <Link to="/privacy" className="text-[var(--txt)] hover:underline">
          Privacy Policy
        </Link>
      </p>
    </footer>
  );
}
