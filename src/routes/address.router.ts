import {
  addAddress,
  getAddress,
  getAddressByUserId,
  updateAddress,
} from "../controllers/address.cntroller";

const express = require("express");
const router = express.Router();

router.get("/getAllAddress", getAddress);
router.get("/getAddressByUserId/:id", getAddressByUserId);
router.post("/addAddress/:id", addAddress);
router.put("/updateAddress/:id", updateAddress);

module.exports = router;
