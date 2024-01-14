import {Request, Response} from "express";
import {passwordHasing} from "../utils/passwordHasing";
import {secretKey} from "../utils/secretKey";
const {User, User_details} = require("../db/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// GET ALL DATA USES
export const getAllUser = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findAll();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

//  REGISTER USER
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {username, email, password} = req.body;
    const newPassword: string = await passwordHasing(password);

    const user = await User.create({
      id: crypto.randomUUID(),
      username,
      email,
      password: newPassword,
    });

    const newUser = {
      username: user.username,
      email: user.email,
    };

    res.status(200).json({
      message: "Registered successfully",
      newUser,
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// LOGIN USER
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({where: {email}});

    if (!user) {
      res.status(403).json({message: "User not found"});
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(404).json({message: "User not found"});
      return;
    }

    const token: string = jwt.sign({user_id: user.id}, secretKey, {
      expiresIn: "1h",
    });

    await User_details.create({
      id: crypto.randomUUID(),
      user_id: user.id,
      refresh_token: token,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({message: "Login Successfully", token});
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

// LOGOUT USER
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization;

    const deleteUser = await User_details.destroy({
      where: {refresh_token: token?.split(" ")[1]},
    });

    if (deleteUser > 0) {
      res.json({success: true, message: "Logout successful"});
    } else {
      res
        .status(404)
        .json({error: "User detail not found for the provided token"});
    }
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// UPDATE USER
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404).json("User not found");
      return;
    }
    const {username, name, email, phone, store_name, sex} = req.body;

    const newUser = await user.update({
      id: crypto.randomUUID(),
      username,
      name,
      email,
      phone,
      store_name,
      sex,
    });

    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// DELETE USER
export const deleteUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      res.status(201).json({error: "User not found"});
      return;
    }

    await user.destroy();

    res.status(200).json({message: "User has been deleted successfullt", user});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
