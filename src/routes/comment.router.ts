import {
  addComment,
  deleteComment,
  getAllComments,
  getAllCommentsByProductId,
  getCommentByUserId,
  getOneComment,
  updateComment,
} from "../controllers/comment.controller";

const express = require("express");
const router = express.Router();

router.get("/getAllComments/", getAllComments);
router.get("/getOneComment/:id", getOneComment);
router.get("/getCommentProductId/:id", getAllCommentsByProductId);
router.get("/getCommentUser/:id", getCommentByUserId);
router.post("/addComment/:id", addComment);
router.put("/updateComment/:id", updateComment);
router.delete("/deleteComment/:id", deleteComment);

module.exports = router;
