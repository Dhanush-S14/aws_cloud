import { useEffect, useState } from "react";
import RoomCard from "../session/RoomCard";
import DeletedRoomCard from "../session/DeletedRoomCard";

export default function PinnedRoomsSection() {
  const [pinnedRooms, setPinnedRooms] = useState([]);
  const [deletedRoomIds, setDeletedRoomIds] = useState(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pinnedRooms") || "[]";
      const rooms = JSON.parse(raw);
      setPinnedRooms(rooms);
    } catch {
      setPinnedRooms([]);
    }
  }, []);

  /**
   * Handle when a room is detected as deleted (404 error from backend)
   * @param {string} roomId - The ID of the deleted room
   */
  const handleRoomNotFound = (roomId) => {
    setDeletedRoomIds((prev) => new Set([...prev, roomId]));
  };

  /**
   * Handle unpinning a deleted room
   * Removes the room from localStorage and updates the state
   * @param {string} roomId - The ID of the room to unpin
   */
  const handleUnpinDeletedRoom = (roomId) => {
    try {
      const raw = localStorage.getItem("pinnedRooms") || "[]";
      const rooms = JSON.parse(raw);
      const updatedRooms = rooms.filter((r) => r._id !== roomId);
      localStorage.setItem("pinnedRooms", JSON.stringify(updatedRooms));
      setPinnedRooms(updatedRooms);
      
      // Remove from deleted set
      setDeletedRoomIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(roomId);
        return newSet;
      });
    } catch (error) {
      console.error("Failed to unpin deleted room:", error);
    }
  };

  return (
    <div className="mb-10">
      {pinnedRooms.length > 0 && (
        <>
          <h1 className="text-2xl font-semibold mb-4 ml-4">Pinned rooms:</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 2xl:gap-6">
            {pinnedRooms.map((room) => (
              deletedRoomIds.has(room._id) ? (
                <DeletedRoomCard
                  key={room._id}
                  room={room}
                  onUnpin={handleUnpinDeletedRoom}
                />
              ) : (
                <RoomCard
                  key={room._id}
                  room={room}
                  showCategory={true}
                  onRoomNotFound={handleRoomNotFound}
                />
              )
            ))}
          </div>
        </>
      )}
    </div>
  );
}
