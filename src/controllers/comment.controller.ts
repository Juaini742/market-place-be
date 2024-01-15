import {Request, Response} from "express";
import {secretKey} from "../utils/secretKey";
const {Comment, Product} = require("../db/models");
const jwt = require("jsonwebtoken");

// GET ALL COMMENTS
export const getAllComments = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const comments = await Comment.findAll();

    res.status(200).json(comments);
  } catch (error) {
    res.json({error: error.message});
  }
};

// GET ALL COMMENT BY USER ID
export const getCommentByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = req.params.id;

    if (!user_id) {
      res.status(404).json("User not found");
      return;
    }

    const comments = await Comment.findAll({
      where: {
        user_id,
      },
    });

    res.status(200).json(comments);
  } catch (error) {
    res.json({error: error.message});
  }
};

// ADD COMMENT
export const addComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = await Product.findByPk(req.params.id);

    if (!productId) {
      res.status(404).json("Product not found");
      return;
    }

    const tokenHeader = req.headers.authorization;
    if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }

    const token = tokenHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, secretKey);
    const user_id = decodedToken.user_id;

    const {rating, message} = req.body;

    const comment = await Comment.create({
      user_id,
      product_id: productId.id,
      rating,
      message,
    });

    res.status(200).json(comment);
  } catch (error) {
    res.json({error: error.message});
  }
};

// UPDATE COMMENT
export const updateComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const comments = await Comment.findByPk(req.params.id);

    if (!comments) {
      res.status(404).json("Comment not found");
      return;
    }

    const {rating, message} = req.body;

    const commentData = await comments.update({
      rating,
      message,
    });

    res.status(200).json(commentData);
  } catch (error) {
    res.json({error: error.message});
  }
};

// DELETE COMMENT
export const deleteComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      res.status(404).json("Comment not found");
      return;
    }

    await comment.destroy();

    res.status(200).json("Comment deleted");
  } catch (error) {
    res.json({error: error.message});
  }
};
