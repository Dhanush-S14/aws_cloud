import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axiosInstance from "@/utils/axios";
import { useToast } from "@/contexts/ToastContext";
import { useUserStore } from "@/stores/userStore";

const Signout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {clearUser}=useUserStore();

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await axiosInstance.post(`/auth/logout`, {}, { withCredentials: true });

        localStorage.removeItem("token");
        localStorage.removeItem("activationToken");
        clearUser();
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed. Please try again.");
      }
    };

    handleSignOut();
  }, [navigate]);

  return null;
};

export default Signout;
