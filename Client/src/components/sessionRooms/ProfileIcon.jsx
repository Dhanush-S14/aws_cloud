import { useState } from "react";
import defaultAvatar from "@/assets/profilePic.avif";

function ProfileIcon({ profileImage, size = 9 }) {
  const [error, setError] = useState(false);

  const src = !profileImage || error ? defaultAvatar : profileImage;

  return (
    <img
      src={src}
      alt="user"
      className={`object-cover w-${size} h-${size} rounded-full`}
      onError={() => setError(true)}
    />
  );
}
export default ProfileIcon;
