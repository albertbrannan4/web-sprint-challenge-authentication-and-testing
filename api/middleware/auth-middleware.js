const credentialsRequired = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(401).json({ message: "username and password required" });
  } else {
    next();
  }
};
module.exports = { credentialsRequired };
