import { useState } from "react";
import UseSocketContext from "@/contexts/SocketContext";
import defaultAvatar from "@/assets/profilePic.avif";

function OnlineFriends() {
  const { onlineUsers } = UseSocketContext();

  const maxVisible = 8;
  const visibleUsers = onlineUsers.slice(0, maxVisible);
  const extraCount = onlineUsers.length - maxVisible;

  const rows = [visibleUsers.slice(0, 4), visibleUsers.slice(4, 8)];

  const truncate = (str) => {
    if (str.length > 12) {
      return str.slice(0, 10) + "...";
    }
    return str;
  };

  return (
    <section>
      {onlineUsers.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-4 txt">Online users</h2>
          <div className="flex flex-col gap-3 w-[100%]">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-evenly flex-wrap ">
                {row.map((user, i) => {
                  const isLast = rowIndex === 1 && i === row.length - 1;
                  const showExtra = isLast && extraCount > 0;

                  return (
                    <div
                      key={user.id}
                      className="flex flex-col items-center mb-3 w-20 overflow-hidden "
                    >
                      <div className="bg-sec rounded-full overflow-hidden size-14 flex items-center justify-center">
                        {showExtra ? (
                          <span className="text-sm font-bold text-white">
                            +{extraCount}
                          </span>
                        ) : (
                          <ProfileIcon profileImage={user.profileImage} />
                        )}
                      </div>
                      {!showExtra && (
                        <h4 className="mt-2 text-sm font-medium text-center txt line-clamp-1">
                          {truncate(user.name.split(" ")[0])}
                        </h4>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function ProfileIcon({ profileImage }) {
  const [error, setError] = useState(false);
  const src = !profileImage || error ? defaultAvatar : profileImage;

  return (
    <img
      src={src}
      alt="user"
      className="object-cover size-full rounded-full"
      onError={() => setError(true)}
    />
  );
}

export default OnlineFriends;
