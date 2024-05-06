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

// GET ADDRESS BY USER ID
export const getAddressByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {id} = (req as any).User;

    const address = await Address.findOne({
      where: {
        user_id: id,
      },
    });

    if (!address) {
      res.status(404).json("Something is going wrong");
      return;
    }

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
    const {id} = (req as any).User;

    const {city, postal_code, privince, country, address} = req.body;

    const addressData = await Address.create({
      id: crypto.randomUUID(),
      user_id: id,
      city,
      postal_code,
      privince,
      country,
      address,
    });

    res.status(200).json(addressData);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// UPDATE ADDRESS ITEM
export const updateAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const addressData = await Address.findByPk(req.params.id);

    if (!addressData) {
      res.status(404).json("Address not found");
      return;
    }

    const {city, postal_code, privince, country, address} = req.body;

    await addressData.update({
      city,
      postal_code,
      privince,
      country,
      address,
    });

    res.status(200).json(addressData);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
