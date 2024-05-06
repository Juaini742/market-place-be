import {
  addAddress,
  getAddress,
  getAddressByUserId,
  updateAddress,
} from "../controllers/address.cntroller";

const express = require("express");
const router = express.Router();

router.get("/getAllAddress", getAddress);
router.get("/getAddressByUserId", getAddressByUserId);
router.post("/addAddress", addAddress);
router.put("/updateAddress/:id", updateAddress);

module.exports = router;
