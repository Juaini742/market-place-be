import {Request, Response} from "express";
import {secretKey} from "../utils/secretKey";
import {CartAttributes, ProductAttributes, UserAttributes} from "src/const";
import {getProductData} from "../utils/productUtils";
const {Cart, Product, User} = require("../db/models");
const jwt = require("jsonwebtoken");

// GET ALL CART ITEMS
export const getAllCart = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const carts = await Cart.findAll();

    res.json(carts);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// GET ALL CART ITEMS BY USER ID
export const getCartByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;

    if (!userId) {
      res.status(404).json("Items not found");
      return;
    }

    const carts: CartAttributes[] = await Cart.findAll({
      where: {
        user_id: userId,
      },
      raw: true,
    });

    if (!carts) {
      res.status(404).json("Items not found");
      return;
    }

    const responseData: CartAttributes[] = [];

    for (const cart of carts) {
      const user: UserAttributes = await User.findOne({
        where: {
          id: cart.user_id,
        },
        raw: true,
      });

      const product: ProductAttributes = await Product.findOne({
        where: {
          id: cart.product_id,
        },
        raw: true,
      });

      const productData: ProductAttributes = await getProductData(
        product,
        user
      );

      const cartData: CartAttributes = {
        id: cart.id,
        user_id: {
          id: user.id,
          avatar: user.avatar,
          username: user.username,
          store_name: user.store_name || null,
        },
        product_id: productData,
        quantity: cart.quantity,
        color: cart.color,
        size: cart.size,
        createdAt: cart.createdAt,
        updatedAt: cart.createdAt,
      };

      responseData.push(cartData);
    }

    res.json(responseData);
  } catch (error) {
    res
      .status(500)
      .json({message: "Internal Server Error", error: error.message});
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

    const tokenHeader = req.headers.authorization;

    if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }

    const token = tokenHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, secretKey);
    const user_id = decodedToken.user_id;

    const {quantity, color, size} = req.body;

    // if (productId.stock < quantity) {
    //   res.status(400).json({message: "Insufficient stock"});
    //   return;
    // }

    // productId.stock -= quantity;

    // await productId.save();

    const cart = await Cart.create({
      id: crypto.randomUUID(),
      user_id,
      product_id: productId.id,
      quantity,
      color,
      size,
    });

    res.json({status: 200, cart});
  } catch (error) {
    res.json({error: error.message});
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

    const {quantity} = req.body;

    await cart.update({
      quantity,
    });
    res.json({status: 200, cart});
  } catch (error) {
    res.json({error: error.message});
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

    res.status(200).json({message: "Delete successfully", certItem});
  } catch (error) {
    res.json({error: error.message});
  }
};
