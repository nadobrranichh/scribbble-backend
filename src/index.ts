import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import { roomsRouter } from "./routes/rooms.routes.js";
import { registerSocketHandlers } from "./sockets/index.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

registerSocketHandlers(io);

app.get("/", (_, res) => res.send("scribbble server says hello!"));

app.use("/rooms", roomsRouter);

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
