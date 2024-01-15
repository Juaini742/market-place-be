import {
  addComment,
  deleteComment,
  getAllComments,
  getCommentByUserId,
  updateComment,
} from "../controllers/comment.controller";

const express = require("express");
const router = express.Router();

router.get("/getAllComments/", getAllComments);
router.get("/getCommentUser/:id", getCommentByUserId);
router.post("/addComment/:id", addComment);
router.put("/updateComment/:id", updateComment);
router.delete("/deleteComment/:id", deleteComment);

module.exports = router;
