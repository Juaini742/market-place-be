import {Request, Response} from "express";
import {snap} from "../utils/midtrans";
import {DataAttributes} from "../constants";
const {
  Address,
  // User,
  Comment,
  Product,
  Shipping,
  Checkout_item,
} = require("../db/models");

export const getCheckout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {id} = (req as any).User;

    const shipping = await Shipping.findAll({
      where: {user_id: id},
    });

    if (!shipping || shipping.length === 0) {
      res.status(404).json("Item not found");
      return;
    }

    const checkout = await Promise.all(
      shipping.map(async (item: any) => {
        const checkoutItems = await Checkout_item.findAll({
          where: {shipping_id: item.id},
        });

        return checkoutItems;
      })
    );

    const flattenedCheckout = checkout.flat();

    const newCheckout = await Promise.all(
      flattenedCheckout.map(async (item: any) => {
        const product = await Product.findByPk(item.product_id);

        return {
          id: item.id,
          product_id: {
            id: product.id,
            product_name: product.product_name,
            category: product.category,
            price: product.price,
            img: product.img,
          },
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          payment_status: item.payment_status,
          createdAt: item.createdAt,
        };
      })
    );

    const finalData = {
      checkout: newCheckout,
      shipping: shipping,
    };

    res.status(200).json(finalData);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const addShiping = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {payment, color, size, product_dates, quantities} = req.body;

    const address_id = req.params.id;

    const address = await Address.findByPk(address_id);
    if (!address) {
      res.status(404).json({message: "User not found"});
      return;
    }

    let data: DataAttributes[] = [];

    const shipping = await Shipping.create({
      id: crypto.randomUUID(),
      user_id: address.user_id,
      address_id: address.id,
      payment,
    });

    if (shipping.id) {
      const checkout = product_dates.map(
        async (item: string, index: number) => {
          await Checkout_item.create({
            id: crypto.randomUUID(),
            shipping_id: shipping.id,
            color: color[index],
            size: size[index],
            product_id: item,
            quantity: quantities[index],
          });
          await Comment.create({
            id: crypto.randomUUID(),
            product_id: item,
            user_id: shipping.user_id,
          });

          const product = await Product.findByPk(item);
          const itemDetail = {
            name: product.product_name,
            price: product.price,
            quantity: quantities[index],
          };

          await product.update({
            sold: product.sold + 1,
            stock: product.stock - quantities[index],
          });

          data.push(itemDetail);
        }
      );

      await Promise.all(checkout);

      const totalGrossAmount: number = data.reduce(
        (total: number, item: {price: number; quantity: number}) =>
          total + item.price * item.quantity,
        0
      );

      const parameters = {
        item_details: data,
        transaction_details: {
          order_id: crypto.randomUUID(),
          gross_amount: totalGrossAmount,
        },
      };

      const token = await snap.createTransactionToken(parameters);

      res.status(201).json({
        message: "Data Shipping Berhasil Dibuat",
        shipping,
        token,
      });
    }
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
