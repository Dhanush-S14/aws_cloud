// components/ProfileCard/ProfileSkeleton.jsx
const ProfileSkeleton = () => {
  return (
    <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-500/50 to-purple-500/5 shadow-2xl pt-6 w-full h-fit relative">
      {/* Skeleton nav */}
      <div className="flex justify-end gap-6 px-4">
        <div className="w-6 h-6 rounded-full bg-gray-400/30"></div>
        <div className="w-6 h-6 rounded-full bg-gray-400/30"></div>
      </div>

      <div className="mx-4">
        {/* Skeleton profile */}
        <div className="relative flex items-center mb-4 gap-4">
          <div className="shrink-0 w-28 h-28 rounded-full bg-gray-400/30"></div>
          <div className="text-center flex-1">
            <div className="h-8 w-14 mx-auto rounded-md bg-gray-400/30 mb-1"></div>
            <div className="h-4 w-18 mx-auto rounded-sm bg-gray-400/20"></div>
          </div>
          <div className="text-center flex-1">
            <div className="h-8 w-14 mx-auto rounded-md bg-gray-400/30 mb-1"></div>
            <div className="h-4 w-18 mx-auto rounded-sm bg-gray-400/20"></div>
          </div>
        </div>

        {/* Skeleton user info */}
        <div className="mb-4">
          <div className="h-6 w-40 rounded-md bg-gray-400/30 mb-2"></div>
          <div className="h-4 w-64 rounded-sm bg-gray-400/20"></div>
        </div>

        {/* Skeleton buttons */}
        <div className="flex flex-wrap justify-center gap-4 my-4">
          <div className="h-10 rounded-lg bg-gray-400/30 flex-1"></div>
          <div className="h-10 rounded-lg bg-gray-400/30 flex-1"></div>
          <div className="h-10 rounded-lg bg-gray-400/30 w-full"></div>
        </div>
      </div>

      {/* Skeleton details */}
      <div className="bg-gray-500/20 rounded-3xl p-4 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-7 w-7 rounded-full bg-gray-400/30"></div>
            <div className="flex-1">
              <div className="h-3 w-16 rounded-sm bg-gray-400/20 mb-1"></div>
              <div className="h-5 w-32 rounded-md bg-gray-400/30"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSkeleton;
