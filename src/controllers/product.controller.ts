import {Request, Response} from "express";
import {secretKey} from "../utils/secretKey";
import {ProductAttributes, UserAttributes} from "../const";
import {getProductData} from "../utils/productUtils";
import {Op} from "sequelize";
import upload from "../utils/multerConfig";
const jwt = require("jsonwebtoken");
const {Product, User, Product_color, Product_size} = require("../db/models");

// GET ALL PRODUCT
export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    keyword,
    page = 1,
    sortBySold,
    sortByPrice,
    sortByLowestPrice,
    sortOrder,
  } = req.query;
  const pageSize: number = 12;
  try {
    let products;
    let totalProducts;

    const filterOptions: any = {};

    if (keyword) {
      filterOptions[Op.or] = [{product_name: {[Op.like]: `%${keyword}%`}}];
    }

    const sortingOptions = [];

    if (sortBySold === "true") {
      sortingOptions.push(["sold", "DESC"]);
    }

    if (sortByPrice === "true") {
      sortingOptions.push(["price", "ASC"]);
    }

    if (sortByLowestPrice === "true") {
      sortingOptions.push(["price", "ASC"]);
    }

    if (sortOrder === "ascending") {
      sortingOptions.push(["product_name", "ASC"]);
    } else if (sortOrder === "descending") {
      sortingOptions.push(["product_name", "DESC"]);
    }

    if (sortingOptions.length > 0) {
      products = await Product.findAll({
        where: filterOptions,
        offset: (Number(page) - 1) * pageSize,
        limit: pageSize,
        order: sortingOptions,
      });

      totalProducts = await Product.count({
        where: filterOptions,
      });
    } else {
      products = await Product.findAll({
        where: filterOptions,
        offset: (Number(page) - 1) * pageSize,
        limit: pageSize,
      });

      totalProducts = await Product.count({
        where: filterOptions,
      });
    }

    const user_id = products.map((item: {user_id: string}) => item.user_id);

    const cleanedUserIds = user_id.filter((userId: any) => userId !== null);

    const users =
      cleanedUserIds.length > 0
        ? await User.findAll({where: {id: cleanedUserIds}})
        : [];

    // const users = await User.findAll({
    //   where: {id: user_id},
    // });

    const productId = products.map((item: any) => item.id);
    const colors = await Product_color.findAll({
      where: {product_id: productId},
    });
    const sizes = await Product_size.findAll({
      where: {product_id: productId},
    });

    const modifiedProducts = products.map((product: ProductAttributes) => {
      const user = users.find((usr: any) => usr.id === product.user_id);
      const productColors = colors
        .filter((clr: any) => clr.product_id === product.id)
        .map((clr: any) => clr.name);
      const productSizes = sizes
        .filter((sze: any) => sze.product_id === product.id)
        .map((sze: any) => sze.name);

      return {
        id: product.id,
        user_id: {
          id: user.id,
          username: user.username,
          store_name: user.store_name || null,
        },
        product_name: product.product_name,
        colors_item: productColors,
        sizes_item: productSizes,
        stock: product.stock,
        category: product.category,
        sold: product.sold,
        price: product.price,
        short_description: product.short_description,
        long_description: product.long_description,
        img: product.img,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });

    const result = {
      Products: modifiedProducts,
      totalProduct: totalProducts,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
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
    const userId = product.user_id;
    const user = await User.findOne({
      where: {id: userId},
    });

    const productData: ProductAttributes = await getProductData(product, user);

    res.status(200).json(productData);
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
    const tokenHeader = req.headers.authorization;

    if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }

    const token = tokenHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, secretKey);
    const user_id = decodedToken.user_id;

    upload.single("file")(req, res, async (err: any) => {
      if (err) {
        res.status(500).json({error: err.message});
        return;
      }
      let finalImageURL = "";
      if (req.file) {
        const {filename} = req.file;
        finalImageURL =
          req.protocol + "://" + req.get("host") + "/Images/" + filename;
      }

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
        img: finalImageURL,
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
        img: finalImageURL,
      };

      res.status(200).json(productResponse);
    });
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

    upload.single("file")(req, res, async (err: any) => {
      if (err) {
        res.status(500).json({error: err.message});
        return;
      }

      let fileUrl = "";
      if (req.file) {
        const {filename} = req.file;
        fileUrl =
          req.protocol + "://" + req.get("host") + "/Images/" + filename;
      }

      const colors = await Product_color.findAll({
        where: {product_id: product.id},
      });

      const sizes = await Product_size.findAll({
        where: {product_id: product.id},
      });

      if (!colors || !sizes) {
        res.status(404).json("Item not found");
        return;
      }

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

      try {
        await product.update({
          product_name,
          stock,
          category,
          sold,
          price,
          short_description,
          long_description,
          img: fileUrl,
        });

        const colorPromises = color_names.map((item: string) => {
          return Product_color.upsert({name: item});
        });

        const sizePromises = size_names.map((item: string) => {
          return Product_size.upsert({name: item});
        });

        const updatedColors = await Promise.all(colorPromises);
        const updatedSizes = await Promise.all(sizePromises);

        const finalData = {
          img: fileUrl,
          product_name,
          colors: updatedColors,
          sizes: updatedSizes,
          stock,
          category,
          sold,
          price,
          short_description,
          long_description,
        };

        res.status(200).json(finalData);
      } catch (updateError) {
        res.status(500).json({
          message: "Error updating product details",
          error: updateError.message,
        });
      }
    });
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

    const colors = await Product_color.findAll({
      where: {product_id: product.id},
    });

    const sizes = await Product_size.findAll({
      where: {product_id: product.id},
    });

    if (!colors || !sizes) {
      res.status(404).json("Item not found");
      return;
    }

    for (const color of colors) {
      await color.destroy();
    }
    for (const size of sizes) {
      await size.destroy();
    }
    await product.destroy();

    res.status(200).json({message: "Product deleted", colors, sizes});
  } catch (error) {
    res
      .status(500)
      .json({meesage: "Internal server error", error: error.message});
  }
};
