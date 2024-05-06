import {midtransPublicClient, midtransPublicSecret} from "../constants";
const Midtrans = require("midtrans-client");

export let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: midtransPublicSecret,
  clientKey: midtransPublicClient,
});
