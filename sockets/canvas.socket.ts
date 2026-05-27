import type { Server, Socket } from "socket.io";
import { rooms } from "../store/store.js";
import { flattenImage } from "../util/canvas.js";
import type { Point, Stroke } from "../types/types.js";

const MAX_POINTS_BEFORE_FLATTENING = 5000;

export function setupCanvasSockets(io: Server, socket: Socket) {
  socket.on("set-dimensions", (data: { roomId: string; dimensions: Point }) => {
    const { roomId, dimensions } = data;
    const room = rooms.get(roomId);
    if (!room) return;
    room.canvasDimensions = dimensions;
    console.log(`CANVAS ${roomId} DIMENSIONS:`, dimensions);
  });

  socket.on("draw", (data: { stroke: Stroke; roomId: string }) => {
    const { stroke, roomId } = data;
    const room = rooms.get(roomId);
    if (!room) return;
    room.strokes.push(stroke);
    room.totalPoints += stroke.points.length;
    console.log("DRAWN. TOTAL POINTS:", room.totalPoints);
    //if there's too many points
    if (room.totalPoints > MAX_POINTS_BEFORE_FLATTENING) {
      console.log("TOO MANY POINTS:", room.totalPoints, room.id);
      flattenImage(socket.id, room);
    }

    // sending this event to everyone in the room except the sender
    socket.to(roomId).emit("drawn", { stroke });
  });

  socket.on("snapshot", (data: { image: string; roomId: string }) => {
    const { image, roomId } = data;
    const room = rooms.get(roomId);
    if (!room) return;
    room.baseImage = image;
    console.log(`ROOM ${roomId}'S IMAGE GOT FLATTENED:`);
    console.log(room.baseImage);
  });
}
