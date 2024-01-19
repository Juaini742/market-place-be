import {Request, Response} from "express";
const {Checkout_item, Product} = require("../db/models");

export const createCheckout = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      res.status(404).json("Product item not found");
      return;
    }

    const product = await Product.findByPk(productId);

    const {quantity, gross_amount, payment_status} = req.body;

    if (product.stock < quantity) {
      res.status(400).json({message: "Insufficient stock"});
      return;
    }

    product.stock -= quantity;

    await product.save();

    const checkout = await Checkout_item.create({
      product_id: productId,
      quantity,
      gross_amount,
      payment_status,
    });

    return res.json(checkout);
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Internal Server Error"});
  }
};

export const chackoutCallback = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(404).json("Checkout item not found");
      return;
    }

    const {transactionStatus} = req.body;

    const checkout = await Checkout_item.findOne({where: {id}});

    if (!checkout) {
      return res.status(404).json({error: "Checkout not found"});
    }

    checkout.payment_status = transactionStatus;
    await checkout.save();

    return res.json({message: "Callback received and processed"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Internal Server Error"});
  }
};
