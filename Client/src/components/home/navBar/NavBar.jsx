import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import AiChatbot from "./AiChatbot";
import PinnedLinks from "./PinnedLinks.jsx";
import Slogan from "./Slogan.jsx";
import OnlineUsers from "./OnlineUsers.jsx";
import Calculator from "./Calculator.jsx";
import { useUserStore } from "@/stores/userStore.js";
import features from "@/config/featureFlags";

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [, setSelectedId] = useState(""); // for AI, do not remove
  const {user}=useUserStore();
  
  useEffect(() => {
    if (user) setIsLoggedIn(true);
  }, []);

  return (
    <div className="flex justify-between items-center bg-transparent z-10">
      <PinnedLinks />
      <Slogan />
      <div className="flex items-center gap-4">
        {isLoggedIn && <OnlineUsers />}
        {features.AI && <AiChatbot onShowId={setSelectedId} />}
        <Calculator />
        {!isLoggedIn && (
          <Link
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2"
            to="/auth/login"
          >
            <User className="w-5 h-5" />
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default NavBar;
