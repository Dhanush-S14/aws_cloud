import { useEffect } from "react";
import TabNavigation from "../components/friendsPage/TabNavigation";
import MainContent from "../components/friendsPage/MainContent";
import NotLogedInPage from "@/components/NotLogedInPage";
import { useSearchParams } from "react-router-dom";
import { useUserStore } from "@/stores/userStore";

function FriendsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {user}=useUserStore();
  const tabs = ["findFriends", "friendRequests", "sentRequests", "allFriends"];
  const activeTab = tabs.includes(searchParams.get("tab"))
    ? searchParams.get("tab")
    : "findFriends";

  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: "findFriends" }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  if (!user) return <NotLogedInPage />;

  return (
    <div className="flex h-screen overflow-hidden">
      <TabNavigation
        activeTab={activeTab}
        onTabChange={(tab) => setSearchParams({ tab }, { replace: true })}
      />
      <MainContent selectedTab={activeTab} />
    </div>
  );
}

export default FriendsPage;
