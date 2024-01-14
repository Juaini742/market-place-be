import {Request, Response} from "express";
const {Address} = require("../db/models");

// GET ALL ADDRESS ITEMS
export const getAddress = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const address = await Address.findAll();

    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// ADD ADDRESS ITEM
export const addAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;

    if (!userId) {
      res.status(404).json("Item not found");
      return;
    }

    const {city, postal_code, province, country, address} = req.body;

    const addressData = await Address.create({
      id: crypto.randomUUID(),
      user_id: userId,
      city,
      postal_code,
      province,
      country,
      address,
    });

    res.status(200).json(addressData);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
