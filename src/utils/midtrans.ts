import {midtransPublicClient, midtransPublicSecret} from "../const";
const Midtrans = require("midtrans-client");

export let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: midtransPublicSecret,
  clientKey: midtransPublicClient,
});
