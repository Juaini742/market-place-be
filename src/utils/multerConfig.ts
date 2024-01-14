import {Request} from "express";
const multer = require("multer");
import path from "path";

const storage = multer.diskStorage({
  destination: function (
    _req: Request,
    _file: Express.Multer.File,
    cb: (arg0: null, arg1: string) => void
  ) {
    cb(null, path.join(process.cwd(), "./public/Images"));
  },
  filename: function (
    _req: Request,
    file: Express.Multer.File,
    cb: (arg0: null, arg1: string) => void
  ) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const newFileName = `${uniqueSuffix}-${file.originalname}`;
    cb(null, newFileName);
  },
});

const upload = multer({storage});

export default upload;
