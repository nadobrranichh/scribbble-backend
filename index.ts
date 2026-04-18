import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors());
const PORT = 3000;

const server = http.createServer(app);

app.get("/", (req, res) => res.send("server says hello!"));

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
