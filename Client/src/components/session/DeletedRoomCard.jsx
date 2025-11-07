import { AlertCircle, PinOff } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * DeletedRoomCard component displays a message when a pinned room has been deleted.
 * It provides an option to unpin the deleted room from the home page.
 *
 * @param {Object} props - Component props
 * @param {Object} props.room - The deleted room object with basic information
 * @param {Function} props.onUnpin - Callback function to handle unpinning the room
 * @returns {JSX.Element} A card displaying the deleted room message
 */
export default function DeletedRoomCard({ room, onUnpin }) {
  const handleUnpin = () => {
    if (onUnpin) {
      onUnpin(room._id);
    }
  };

  return (
    <div className="relative bg-sec backdrop-blur-md p-6 rounded-3xl shadow border-2 border-red-500/30">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 mt-1">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold txt mb-2">
            Room Not Found
          </h3>
          <p className="txt-dim text-sm">
            The room <span className="font-medium text-red-400">&quot;{room.name}&quot;</span> has been deleted!
          </p>
        </div>
      </div>

      <div className="bg-red-500/10 rounded-lg p-3 mb-4">
        <p className="text-sm txt-dim">
          This room is no longer available. It may have been deleted by its creator or removed from the platform.
        </p>
      </div>

      <Button
        onClick={handleUnpin}
        variant="destructive"
        className="w-full flex items-center justify-center gap-2"
      >
        <PinOff className="w-5 h-5" />
        Unpin Room
      </Button>
    </div>
  );
}
