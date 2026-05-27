import { io } from "../index.js";
import type { Room } from "../types/types.js";

export function flattenImage(socketId: string, room: Room) {
  io.to(socketId).emit("request-snapshot");
  room.strokes = [];
  room.totalPoints = 0;
}
