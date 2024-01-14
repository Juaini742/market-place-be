import {ColorAndSize} from "../const/";

const {Product_color, Product_size} = require("../db/models");

export const getProductData = async (product: any, user: any): Promise<any> => {
  const colors = await Product_color.findAll({
    where: {
      product_id: product.id,
    },
  });

  const sizes = await Product_size.findAll({
    where: {
      product_id: product.id,
    },
  });

  return {
    id: product.id,
    user_id: {
      id: user.id,
      username: user.username,
      store_name: user.store_name || null,
    },
    product_name: product.product_name,
    colors_item: colors.map((item: ColorAndSize) => item.name),
    sizes_item: sizes.map((item: ColorAndSize) => item.name),
    stock: product.stock,
    category: product.category,
    sold: product.sold,
    price: product.price,
    short_description: product.short_description,
    long_description: product.long_description,
    img: product.img,
    createdAt: product.createdAt,
    updatedAt: product.createdAt,
  };
};
