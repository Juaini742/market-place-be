import {Request, Response} from "express";
import {secretKey} from "../utils/secretKey";
const {User_details} = require("../db/models");
const jwt = require("jsonwebtoken");

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const refreshToken = req.header("Authorization")?.replace("Bearer ", "");

    if (!refreshToken) {
      res.status(403).send("Refresh token is missing");
      return;
    }

    const user = await User_details.findOne({
      where: {refresh_token: refreshToken},
    });

    if (!user) {
      res.status(400).send("Invalid refresh token");
      return;
    }

    const newToken: string = await jwt.sign(
      {user_id: user.user_id},
      secretKey,
      {
        expiresIn: "24h",
      }
    );

    await User_details.update(
      {refresh_token: newToken},
      {
        where: {user_id: user.user_id},
      }
    );

    res.status(200).json(newToken);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
