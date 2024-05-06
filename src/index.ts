import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
const http = require("http");
const { Server } = require("socket.io");
import router from "./routes/router";
import path from "path";
import cookieParser from "cookie-parser";
import { Socket } from "socket.io";

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

io.on("connection", (_socket: Socket) => {});

app.listen(process.env.SERVER_PORT, () => {
  console.log("Server Running");
});
