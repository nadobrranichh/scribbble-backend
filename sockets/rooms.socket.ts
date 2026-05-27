import type { Server, Socket } from "socket.io";
import { generateRoomId } from "../util/rooms.js";
import { rooms, users } from "../store/store.js";

export function setupRoomsSockets(io: Server, socket: Socket) {
  socket.on("create-room", () => {
    const roomId = generateRoomId();
    const user = users.get(socket.id);
    if (!user) return;
    rooms.set(roomId, {
      id: roomId,
      users: [user],
      baseImage: null,
      strokes: [],
      totalPoints: 0,
      canvasDimensions: { x: 0, y: 0 },
    });
    user.roomId = roomId;
    socket.join(roomId);
    console.log(`USER CREATED ROOM ${roomId}`);
    console.log("ROOM:", rooms.get(roomId));
    socket.emit("room-created", roomId);
  });

  socket.on("join-room", (roomId: string) => {
    const room = rooms.get(roomId);
    const user = users.get(socket.id);
    if (!room || !user) return;
    user.roomId = roomId;
    room.users.push(user);
    socket.join(room.id);
    socket.emit("room-joined", room);
    console.log(`USER JOINED ROOM ${roomId}`);
    console.log("ROOM:", room);
  });

  socket.on("leave-room", (roomId: string) => {
    const room = rooms.get(roomId);
    const user = users.get(socket.id);
    if (!room || !user) return;
    user.roomId = null;
    room.users.filter((u) => u.socketId !== user.socketId);
    console.log(`USER ${user.socketId} LEFT ROOM ${room.id}`);
  });
}
