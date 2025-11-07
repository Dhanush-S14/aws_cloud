import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/contexts/ToastContext";

export default function GoogleRedirect() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { toast } = useToast();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;

    const params = new URLSearchParams(search);
    console.log(params);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");

    if (token && refreshToken) {
      hasProcessed.current = true;
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      window.dispatchEvent(new Event("tokenChanged"));
      toast.success("Login successful! Welcome back.");
      navigate("/", { replace: true });
    } else {
      navigate("/auth/login");
    }
  }, [navigate, search]);

  return <div className="text-black font-lg m-8">Logging you in…</div>;
}