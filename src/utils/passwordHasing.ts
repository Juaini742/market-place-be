const bcrypt = require("bcryptjs");

export const passwordHasing = async (password: string): Promise<string> => {
  const salt = bcrypt.genSaltSync(10);

  return bcrypt.hash(password, salt);
};
