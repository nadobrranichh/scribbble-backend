import type { Server, Socket } from "socket.io";
import { users } from "../store/store.js";

export function setupNameSettingSockets(io: Server, socket: Socket) {
  io.on("set-name", (name: string) => {
    const user = users.get(socket.id);
    if (user) user.name = name;
  });
}
