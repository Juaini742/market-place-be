import {Request, Response} from "express";
const {Comment, Product, User} = require("../db/models");

// GET ALL COMMENTS
export const getAllComments = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const comments = await Comment.findAll({
      include: [
        {
          model: User,
          attributes: ["name", "avatar"],
        },
        {
          model: Product,
          attributes: ["id", "img", "product_name", "price"],
        },
      ],
    });

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
    const comment = await Comment.findOne({
      where: {id},
      attributes: {exclude: ["user_id", "product_id"]},
      include: [
        {
          model: User,
          attributes: ["id"],
        },
        {
          model: Product,
          attributes: ["id", "img", "product_name", "price"],
        },
      ],
    });

    res.status(200).json(comment);
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
    const {id} = (req as any).User;

    const comments = await Comment.findAll({
      where: {
        user_id: id,
      },
      attributes: {exclude: ["user_id", "product_id"]},
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Product,
          attributes: ["id", "img", "product_name", "price"],
        },
      ],
    });

    res.status(200).json(comments);
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
      attributes: {exclude: ["user_id", "product_id"]},
      include: [
        {
          model: User,
          attributes: ["id", "name", "avatar", "store_name"],
        },
        {
          model: Product,
          attributes: ["id", "img", "product_name", "price"],
        },
      ],
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

    const {id} = (req as any).User;
    const {rating, message} = req.body;

    const comment = await Comment.create({
      id: crypto.randomUUID(),
      user_id: id,
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
