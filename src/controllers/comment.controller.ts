import {Request, Response} from "express";
import {secretKey} from "../utils/secretKey";
const {Comment, Product, User} = require("../db/models");
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

// GET ONE COMMENT
export const getOneComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {id} = req.params;
    if (!id) {
      res.status(404).json("Comment not found");
      return;
    }
    const comment = await Comment.findByPk(id);
    const product = await Product.findByPk(comment.product_id);

    const finalData = {
      id: comment.id,
      user_id: comment.user_id,
      product_id: {
        id: product.id,
        img: product.img,
        product_name: product.product_name,
        price: product.price,
      },
      rating: comment.rating,
      message: comment.message,
    };

    res.status(200).json(finalData);
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
    const finalData = await Promise.all(
      comments.map(async (item: any) => {
        const data = await Product.findByPk(item.product_id);
        const user = await User.findByPk(item.user_id);
        return {
          id: item.id,
          user_id: {
            name: user.name,
          },
          message: item.message,
          rating: item.rating,
          product_id: {
            id: data.id,
            img: data.img,
            product_name: data.product_name,
            price: data.price,
          },
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      })
    );

    res.status(200).json(finalData);
  } catch (error) {
    res.json({error: error.message});
  }
};

// GET ALL COMMENTS BY PRODUCT ID
export const getAllCommentsByProductId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {id} = req.params;

    if (!id) {
      res.status(404).json("Product not found");
      return;
    }

    const comments = await Comment.findAll({
      where: {product_id: id},
    });

    const finalData = await Promise.all(
      comments.map(async (item: any) => {
        const user = await User.findByPk(item.user_id);

        return {
          id: item.id,
          rating: item.rating,
          message: item.message,
          user_id: {
            name: user.name,
            avatar: user.avatar,
          },
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      })
    );

    res.status(200).json(finalData);
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
      id: crypto.randomUUID(),
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
