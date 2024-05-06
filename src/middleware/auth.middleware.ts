import {Request, Response, NextFunction} from "express";
import {secretKey} from "../utils/secretKey";
const {User_details, User} = require("../db/models");
const jwt = require("jsonwebtoken");

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies["token"];

    if (!token) {
      return next(new Error("Authorization is missing"));
    }

    const decodedToken = jwt.verify(token, secretKey, {
      expiresIn: "24h",
    });

    if (decodedToken.exp <= Date.now() / 1000) {
      throw new Error("Token has expired");
    }

    const userDetail = await User_details.findOne({
      where: {refresh_token: token},
    });

    if (!userDetail) {
      throw new Error("You are not authenticated to access this data");
    }

    const user = await User.findByPk(decodedToken.user_id);

    if (!user) {
      return next("User unauthorized");
    }

    (req as any).User = {
      id: user.dataValues.id,
    };

    next();
  } catch (error) {
    return next(error);
  }
};
