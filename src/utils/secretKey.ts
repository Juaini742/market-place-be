const crypto = require("crypto");

export const secretKey = crypto.randomBytes(32);
