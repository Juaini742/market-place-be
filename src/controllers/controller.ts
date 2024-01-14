import {Request, Response} from "express";
import upload from "../utils/multerConfig";
const {File} = require("../db/models");

export const postFile = async (req: Request, res: Response): Promise<void> => {
  try {
    upload.single("file")(req, res, async (err: any) => {
      if (err) {
        res.status(500).json({error: err.message});
        return;
      }

      if (!req.file) {
        res.status(400).json({error: "No file uploaded"});
        return;
      }
      const {filename} = req.file;

      const file = await File.create({
        avatar: filename,
      });

      res.status(200).json({message: "File uploaded successfully", file});
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
