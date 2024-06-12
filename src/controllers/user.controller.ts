import { Request, Response } from "express";
import { passwordHasing } from "../utils/passwordHasing";
import { secretKey } from "../utils/secretKey";
// import upload from "../utils/multerConfig";
const { User, User_details, Address } = require("../db/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import cloudinary from "cloudinary";
import { uploadedImage } from "../utils/cloudinaryConfig";

// GET ALL DATA USESs
export const getAllUser = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findAll();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOneUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = (req as any).User;

    const user = await User.findByPk(id);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET USER BY TOKEN
export const getUserByToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = (req as any).User;

    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ error: "User is not found" });
      return;
    }

    const { password, ...dataUser } = user.dataValues;

    res.status(200).json({ dataUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  REGISTER USER
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
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

    await Address.create({
      id: crypto.randomUUID(),
      user_id: user.id,
    });

    res.status(200).json({
      message: "Registered successfully",
      newUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN USER
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(403).json({ message: "User not found" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const token: string = jwt.sign({ user_id: user.id }, secretKey, {
      expiresIn: "1h",
    });

    await User_details.create({
      id: crypto.randomUUID(),
      user_id: user.id,
      refresh_token: token,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
      sameSite: "none",
    });

    const { id } = user.dataValues;

    res.status(200).json({ message: "Login Successfully", id });
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
    const { id } = (req as any).User;

    const user = await User_details.findOne({ where: { user_id: id } });

    if (!user) {
      res
        .status(404)
        .json({ error: "User detail not found for the provided token" });
      return;
    }

    res.cookie("token", secretKey, {
      httpOnly: true,
      secure: true,
      maxAge: 0,
    });

    await user.destroy();

    res.json({ success: true, message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE USER
// export const updateUser = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const user = await User.findByPk(req.params.id);

//     if (!user) {
//       res.status(404).json("User not found");
//       return;
//     }

// upload.single("file")(req, res, async (err: any) => {
//   if (err) {
//     res.status(500).json({ error: err.message });
//     return;
//   }

//   if (req.file) {
//     const { filename } = req.file;

//     let finalImageURL =
//       "https://marketplace-api.jcraftstudio.my.id" + "/Images/" + filename;

//     await user.update({ avatar: finalImageURL });
//   }

//   const { username, name, email, phone, store_name, sex } = req.body;

//   const newUser = await user.update({
//     username,
//     name,
//     email,
//     phone,
//     store_name,
//     sex,
//   });

//   res.status(200).json(newUser);
// });

//     const file = req.file as Express.Multer.File;

//     const updateImageURL = await uploadedImage(file);

//     const { username, name, email, phone, store_name, sex } = req.body;

//     const newUser = await user.update({
//       avatar: updateImageURL,
//       username,
//       name,
//       email,
//       phone,
//       store_name,
//       sex,
//     });

//     res.status(200).json(newUser);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// UPDATE USER
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const file = req.file as Express.Multer.File;

    let updateImageURL = user.avatar;

    if (file) {
      updateImageURL = await uploadedImage(file);

      if (user.avatar) {
        const publicId = user.avatar.split("/").pop().split(".")[0];
        await cloudinary.v2.uploader.destroy(publicId);
      }
    }

    const { username, name, email, phone, store_name, sex } = req.body;

    const updatedUser = await user.update({
      avatar: updateImageURL,
      username,
      name,
      email,
      phone,
      store_name,
      sex,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      res.status(201).json({ error: "User not found" });
      return;
    }

    await user.destroy();

    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      sameSite: "none",
    });

    res
      .status(200)
      .json({ message: "User has been deleted successfullt", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
