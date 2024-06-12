import { Request, Response } from "express";
// import {CartAttributes, ProductAttributes, UserAttributes} from "../constants";
// import {getProductData} from "../utils/productUtils";
const { Cart, Product, User } = require("../db/models");

// GET ALL CART ITEMS
export const getAllCart = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const carts = await Cart.findAll();

    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL CART ITEMS BY USER ID
export const getCartByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = (req as any).User;

    const carts = await Cart.findAll({
      where: {
        user_id: id,
      },
      attributes: { exclude: ["user_id", "product_id"] },
      include: [
        {
          model: User,
          attributes: ["id", "avatar", "username", "store_name"],
        },
        {
          model: Product,
          attributes: {
            exclude: ["user_id", "short_description", "long_description"],
          },
        },
      ],
    });

    if (!carts || carts.length === 0) {
      res.status(404).json({ message: "Items not found" });
      return;
    }

    res.json(carts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// ADD CART ITEM BY USER ID
export const addCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = await Product.findByPk(req.params.id);

    if (!productId) {
      res.status(404).json("Product not found");
      return;
    }
    const { id } = (req as any).User;
    const { color, quantity, size } = req.body;

    // if (productId.stock < quantity) {
    //   res.status(400).json({message: "Insufficient stock"});
    //   return;
    // }

    // productId.stock -= quantity;

    // await productId.save();

    if (!quantity || !color || !size) {
      res.status(400).json({ message: "Please fill all the fields" });
      return;
    }

    const carts = await Cart.findOne({
      where: {
        product_id: productId.id,
      },
    });

    if (carts) {
      res.status(400).json({ message: "This product has already been saved" });
      return;
    }

    const cart = await Cart.create({
      id: crypto.randomUUID(),
      user_id: id,
      product_id: productId.id,
      quantity,
      color,
      size,
    });

    res.json({ status: 200, cart });
  } catch (error) {
    res.json({ error: error.message });
  }
};

// UPDARE CART ITEM
export const updateCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cartId = req.params.id;

    if (!cartId) {
      res.status(404).json("Items not found");
      return;
    }

    const cart = await Cart.findByPk(cartId);

    const { quantity } = req.body;

    await cart.update({
      quantity,
    });
    res.json({ status: 200, cart });
  } catch (error) {
    res.json({ error: error.message });
  }
};

// DELETE CART ITEM
export const deleteCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const carts = await Cart.findByPk(req.params.id);

    if (!carts) {
      res.status(404).json("Items not found");
      return;
    }

    const certItem = await carts.destroy();

    res.status(200).json({ message: "Delete successfully", certItem });
  } catch (error) {
    res.json({ error: error.message });
  }
};
