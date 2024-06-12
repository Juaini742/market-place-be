import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
const http = require("http");
const { Server } = require("socket.io");
import router from "./routes/router";
import path from "path";
import cookieParser from "cookie-parser";
import { Socket } from "socket.io";
import multer from "multer";

const app = express();
app.use(cookieParser());
const server = http.createServer(app);
const io = new Server(server, {
  origin: true,

  methods: ["GET", "POST"],
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.use(express.static(path.join("public")));

app.use("/api", router);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ message: err.message });
  } else if (err) {
    res.status(500).json({ message: err.message });
  }
});

app.use("/", (_req: Request, res: Response) => {
  res.status(200).json("Application work");
});

io.on("connection", (_socket: Socket) => {});

app.listen(process.env.SERVER_PORT, () => {
  console.log("Server Running");
});
