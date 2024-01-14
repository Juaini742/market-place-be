// import upload from "../utils/multerConfig";
import {postFile} from "../controllers/controller";
const express = require("express");
const router = express.Router();
// import {Request, Response} from "express";
// import path from "path";

// const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: function (
//     _req: Request,
//     _file: Express.Multer.File,
//     cb: (arg0: null, arg1: string) => void
//   ) {
//     cb(null, path.join(process.cwd(), "./public/Images"));
//   },
//   filename: function (
//     _req: Request,
//     file: Express.Multer.File,
//     cb: (arg0: null, arg1: string) => void
//   ) {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({storage});

// router.post(
//   "/newUpload",
//   upload.single("file"),
//   (req: Request, res: Response) => {
//     res.json(req.file);
//   }
// );
router.post("/newUpload", postFile);

module.exports = router;
