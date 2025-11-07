import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Analytics } from "@vercel/analytics/react";

const root = document.getElementById("root");

createRoot(root).render(
  <StrictMode>
    <App className="transition-all" />
    <Analytics />
  </StrictMode>
);
