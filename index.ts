import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import { roomsRouter } from "./routes/rooms.routes.js";
import { registerSocketHandlers } from "./sockets/index.js";
dotenv.config();

const app = express();
app.use(cors());
const PORT = 3000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

registerSocketHandlers(io);

app.get("/", (_, res) => res.send("scribbble server says hello!"));

app.use("/rooms", roomsRouter);

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
