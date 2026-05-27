import type { Server } from "socket.io";
import { users, rooms } from "../store/store.js";
import { setupRoomsSockets } from "./rooms.socket.js";
import { setupCanvasSockets } from "./canvas.socket.js";
import { setupNameSettingSockets } from "./names.socket.js";

export function registerSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    console.log(`user connected! ${socket.id}`);
    users.set(socket.id, { socketId: socket.id, roomId: null, name: null });

    setupRoomsSockets(io, socket);

    setupCanvasSockets(io, socket);

    setupNameSettingSockets(io, socket);

    socket.on("disconnect", (reason) => {
      console.log(`User disconnected: ${socket.id}. Reason: ${reason}`);
      const user = users.get(socket.id);
      if (!user) return;
      if (user.roomId) {
        const room = rooms.get(user.roomId);
        if (!room) return users.delete(socket.id);
        socket.to(room.id).emit("room-left", user);
        const i = room.users.findIndex((u) => u.socketId === socket.id);
        if (i !== -1) room.users.splice(i, 1);
        if (room.users.length === 0) rooms.delete(room.id);
      }
      users.delete(socket.id);
    });
  });
}
