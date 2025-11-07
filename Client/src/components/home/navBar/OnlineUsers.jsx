import UseSocketContext from "@/contexts/SocketContext.jsx";
import { useState } from "react";
import defaultAvatar from "@/assets/profilePic.avif";

export default function OnlineUsers() {
  const { onlineUsers } = UseSocketContext();

  return (
    <div className="flex items-center gap-1">
      {onlineUsers.length > 0 && (
        <div className="flex">
          {onlineUsers.slice(0, 4).map(({ id, profileImage }) => (
            <ProfileImage key={id} src={profileImage} />
          ))}
        </div>
      )}
      <h2 className="font-semibold txt whitespace-nowrap">
        {`${onlineUsers.length} online`}
      </h2>
    </div>
  );
}

function ProfileImage({ src }) {
  const [error, setError] = useState(false);
  const imgSrc = error || !src ? defaultAvatar : src;

  return (
    <div className="border-4 -ml-4 border-[var(--bg-primary)] rounded-full overflow-hidden size-8">
      <img
        src={imgSrc}
        alt="User"
        className="size-full object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
}
