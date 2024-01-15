import {authMiddleware} from "../middleware/auth.middleware";
import {
  deleteUserById,
  getAllUser,
  getUserByToken,
  login,
  logout,
  register,
  updateUser,
} from "../controllers/user.controller";
import {refreshToken} from "../controllers/refreshToken.controller";

const express = require("express");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", authMiddleware, getAllUser);
router.get("/getUserByToken", authMiddleware, getUserByToken);
router.put("/updateUser/:id", authMiddleware, updateUser);
router.post("/logout", authMiddleware, logout);
router.get("/refreshToken", authMiddleware, refreshToken);
router.post("/deleteUser/:id", deleteUserById);

module.exports = router;
