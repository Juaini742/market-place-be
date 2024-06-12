import { Request, Response, NextFunction } from "express";
import { secretKey } from "../utils/secretKey";
const { User_details, User } = require("../db/models");
const jwt = require("jsonwebtoken");

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies["token"];

    if (!token) {
      return next(new Error("Authorization is missing"));
    }

    let decodedToken;

    try {
      decodedToken = jwt.verify(token, secretKey, {
        ignoreExpiration: false,
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        res.cookie("token", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          expires: new Date(0),
          sameSite: "none",
        });
        return res.status(401).json({ message: "Unauthorized: Token expired" });
      }
      throw error;
    }

    const userDetail = await User_details.findOne({
      where: { refresh_token: token },
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
