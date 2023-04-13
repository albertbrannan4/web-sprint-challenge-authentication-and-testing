module.exports = {
  JWT_SECRET:
    process.env.JWT_SECRET || "no one is allowed to know the secret 8675309",
  BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || 8,
};
