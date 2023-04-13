const db = require("../../data/dbConfig");

const credentialsRequired = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(401).json({ message: "username and password required" });
  } else {
    next();
  }
};

const usernameAvailable = async (req, res, next) => {
  const { username } = req.body;
  const [isAvailable] = await db("users").where("username", username);
  if (isAvailable) {
    res.status(401).json({ message: "username taken" });
  } else {
    next();
  }
};
module.exports = { credentialsRequired, usernameAvailable };
