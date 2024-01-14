import {
  chackoutCallback,
  createCheckout,
} from "../controllers/checkout.controller";

const express = require("express");
const router = express.Router();

router.post("/create-checkout/:id", createCheckout);

router.post("/callback/:id", chackoutCallback);

module.exports = router;
