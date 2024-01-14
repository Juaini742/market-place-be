import {Request, Response} from "express";
import {secretKey} from "../utils/secretKey";
import {ProductAttributes, UserAttributes} from "../const";
import {getProductData} from "../utils/productUtils";
const jwt = require("jsonwebtoken");
const {Product, User, Product_color, Product_size} = require("../db/models");

// GET ALL PRODUCT
export const getAllProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Product.findAll();

    res.status(200).json(products);
  } catch (error) {
    throw new Error(error.message);
  }
};

// GET PRODUCT BY ID
export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      res.status(404).json("Product not found");
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    throw new Error(error.message);
  }
};

// GET ALL PRODUCT BY USER ID
export const getProductByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;

    if (!userId) {
      res.status(400).json({message: "Invalid user ID"});
      return;
    }

    const products: ProductAttributes[] = await Product.findAll({
      where: {
        user_id: userId,
      },
      raw: true,
    });

    if (!products) {
      res.status(404).json({message: "User not found"});
      return;
    }

    const responseData: ProductAttributes[] = [];

    for (const product of products) {
      const user: UserAttributes = await User.findOne({
        where: {
          id: product.user_id,
        },
        raw: true,
      });

      const productData: ProductAttributes = await getProductData(
        product,
        user
      );

      responseData.push(productData);
    }
    res.status(200).json(responseData);
  } catch (error) {
    res
      .status(500)
      .json({message: "Internal Server Error", error: error.message});
  }
};

// ADD PRODUC BY USER ID
export const addProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      product_name,
      color_names,
      size_names,
      stock,
      category,
      sold,
      price,
      short_description,
      long_description,
    } = req.body;

    const tokenHeader = req.headers.authorization;

    if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }

    const token = tokenHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, secretKey);
    const user_id = decodedToken.user_id;

    const product = await Product.create({
      id: crypto.randomUUID(),
      user_id,
      product_name,
      stock,
      category,
      sold,
      price,
      short_description,
      long_description,
    });

    const colorPromises = color_names.map(async (color_name: string) => {
      await Product_color.create({
        name: color_name,
        product_id: product.id,
      });
    });

    const sizePromises = size_names.map(async (size_name: string) => {
      await Product_size.create({
        name: size_name,
        product_id: product.id,
      });
    });

    await Promise.all(colorPromises);
    await Promise.all(sizePromises);

    const productResponse = {
      id: product.id,
      user_id,
      product_name,
      colors: color_names,
      sizes: size_names,
      stock,
      category,
      sold,
      price,
      short_description,
      long_description,
    };

    res.status(200).json(productResponse);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// UPDATE PRODUCT
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      res.status(404).json("Product not found");
      return;
    }

    const {
      product_name,
      stock,
      category,
      sold,
      price,
      short_description,
      long_description,
    } = req.body;

    const oldProduct = await product.update({
      product_name,
      stock,
      category,
      sold,
      price,
      short_description,
      long_description,
    });

    res.status(200).json(oldProduct);
  } catch (error) {
    res
      .status(500)
      .json({meesage: "Internal server error", error: error.message});
  }
};

// DELETE PRODUCT
export const deleteProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      res.status(404).json("Product not found");
      return;
    }

    await product.destroy();

    res.status(200).json({message: "Product deleted", product});
  } catch (error) {
    res
      .status(500)
      .json({meesage: "Internal server error", error: error.message});
  }
};