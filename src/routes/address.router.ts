import {addAddress, getAddress} from "../controllers/address.cntroller";

const express = require("express");
const router = express.Router();

router.get("/getAllAddress", getAddress);
router.post("/addAddress/:id", addAddress);

module.exports = router;
