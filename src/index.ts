import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import router from "./routes/router";
import path from "path";
const io = require("socket.io");

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors({origin: true, credentials: true}));

app.use(express.static(path.join("public")));

app.options("/socket.io", cors());
app.use("/api", router);
const server = app.listen(process.env.SERVER_PORT, () => {
  console.log("Server Running");
});

io(server, {
  origin: true,
  methods: ["GET", "POST"],
});
