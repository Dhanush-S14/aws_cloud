import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserDetails } from "@/api/userApi";
import { useUserStore } from "@/stores/userStore";

export default function UserInitializer({ children }) {
  const { setUser } = useUserStore();
  const [hasToken, setHasToken] = useState(!!localStorage.getItem("token"));

  // Listen for token changes in localStorage
  useEffect(() => {
    const checkToken = () => {
      const tokenExists = !!localStorage.getItem("token");
      setHasToken(tokenExists);
    };

    // Check immediately
    checkToken();

    // Listen for storage events (token changes)
    window.addEventListener("storage", checkToken);

    // Also listen for a custom event we'll dispatch after login
    const handleTokenChange = () => checkToken();
    window.addEventListener("tokenChanged", handleTokenChange);

    return () => {
      window.removeEventListener("storage", checkToken);
      window.removeEventListener("tokenChanged", handleTokenChange);
    };
  }, []);

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      return await fetchUserDetails();
    },
    enabled: hasToken,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
    if (isError) {
      setUser(null);
    }
  }, [data, isError, error, setUser]);

  if (hasToken && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return children;
}