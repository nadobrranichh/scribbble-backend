import express from "express";
import { rooms } from "../store/store.js";

export const roomsRouter = express.Router();

roomsRouter.get("/", (req, res) => {
  const roomId = req.query.id;
  if (typeof roomId !== "string") {
    res.send([]);
    return;
  }
  // looking for rooms based on the entered room id.
  const foundRooms = Array.from(
    rooms.entries().filter(([k]) => k.includes(roomId)),
  ).map(([_, v]) => v);

  res.send(foundRooms);
});
