import {addShiping, getCheckout} from "../controllers/shpping.controller";

const express = require("express");
const router = express.Router();

router.get("/shipping/:id", getCheckout);
router.post("/shipping/:id", addShiping);

module.exports = router;
