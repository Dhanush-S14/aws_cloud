import { useState } from "react";
import { useFriends, useRemoveFriend } from "@/queries/friendQueries";
import { User, Search } from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmRemoveFriendModal from "../ConfirmRemoveFriendModal";
import { Button } from "@/components/ui/button";

const Friends = () => {
  const { data: friends = [], isLoading } = useFriends();
  const { mutate: removeFriend } = useRemoveFriend();

  const [selectedFriend, setSelectedFriend] = useState(null);
  const [search, setSearch] = useState("");

  const handleRemoveClick = (friend) => {
    setSelectedFriend(friend);
  };

  const confirmRemove = () => {
    if (selectedFriend) {
      removeFriend(selectedFriend._id);
      setSelectedFriend(null);
    }
  };

  const cancelRemove = () => {
    setSelectedFriend(null);
  };

  const filteredFriends = friends.filter((friend) => {
    const name = `${friend.FirstName || ""} ${friend.LastName || ""}`.toLowerCase();
    const username = (friend.Username || "").toLowerCase();
    return (
      name.includes(search.toLowerCase()) ||
      username.includes(search.toLowerCase())
    );
  });

  const LoadingSkeleton = () => (
    <div className="space-y-2 min-w-[600px] rounded-2xl overflow-hidden">
      {[...Array(12)].map((_, index) => (
        <div key={index} className="p-4 rounded-md flex justify-between bg-sec">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-ter rounded-full animate-pulse"></div>
            <div className="h-5 bg-ter rounded w-32 animate-pulse"></div>
          </div>
          <div className="h-8 bg-ter rounded w-20 animate-pulse"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold txt">Friends List</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--txt-dim)" }}
            />
            <input
              type="text"
              placeholder="Search friends"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="txt px-4 py-2 pl-10 w-96 bg-transparent"
              style={{
                color: "var(--txt)",
                background: "transparent",
                border: "none",
                borderBottom: "1.5px solid var(--btn)",
                borderRadius: 0,
                outline: "none",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
            />
          </div>
          <Link
            to={"/session"}
            className="txt px-4 py-2 font-semibold no-underline cursor-pointer"
            style={{
              background: "var(--btn)",
              color: "#fff",
              borderRadius: "var(--radius)",
              border: "2px solid var(--btn)",
              boxShadow: "0 2px 8px 0 rgba(var(--shadow-rgb),0.15)",
              transition: "background 0.2s, box-shadow 0.2s, border-color 0.2s",
              textDecoration: "none",
              display: "inline-block",
            }}
            onMouseOver={e => e.currentTarget.style.background = "var(--btn-hover)"}
            onMouseOut={e => e.currentTarget.style.background = "var(--btn)"}
          >
            Find friends
          </Link>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : filteredFriends.length === 0 ? (
        <p className="txt">No friends found.</p>
      ) : (
        <ul className="space-y-2 min-w-[600px] rounded-2xl overflow-hidden">
          {filteredFriends.map((friend) => (
            <li
              key={friend._id}
              className="p-4 rounded-md flex justify-between bg-sec"
            >
              <div className="flex items-center gap-4">
                <Link
                  to={`/user/${friend._id}`}
                  className="flex items-center gap-4 hover:underline"
                >
                  {friend.ProfilePicture ? (
                    <img
                      src={friend.ProfilePicture}
                      className="w-9 h-9 rounded-full"
                      alt="profile"
                    />
                  ) : (
                    <div className="p-2 bg-ter rounded-full">
                      <User className="w-7 h-7" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-medium line-clamp-1 txt">
                      {friend.FirstName
                        ? `${friend.FirstName} ${friend.LastName || ""}`
                        : "old-user"}
                    </h4>
                    {friend.Username && (
                      <p className="text-sm txt">{friend.Username}</p>
                    )}
                  </div>
                </Link>
              </div>
              <Button
                onClick={() => handleRemoveClick(friend)}
                disabled={friend.isRemoved}
                variant={friend.isRemoved ? "transparent" : "secondary"}
                className={`txt px-3 py-1 rounded ${
                  friend.isRemoved ? "bg-ter" : "hover:bg-red-500"
                }`}
              >
                {friend.isRemoved ? "Friend Removed" : "Remove"}
              </Button>
            </li>
          ))}
        </ul>
      )}

      {selectedFriend && (
        <ConfirmRemoveFriendModal
          onConfirm={confirmRemove}
          onCancel={cancelRemove}
        />
      )}
    </div>
  );
};

export default Friends;
