const router = require("express").Router();
const db = require("../../data/dbConfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, BCRYPT_ROUNDS } = require("../../secrets");
const {
  credentialsRequired,
  usernameAvailable,
} = require("../middleware/auth-middleware");

router.post(
  "/register",
  credentialsRequired,
  usernameAvailable,
  async (req, res) => {
    // res.end("implement register, please!");
    /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
    try {
      let { username, password } = req.body;
      const hash = bcrypt.hashSync(password, BCRYPT_ROUNDS);
      const [newUserId] = await db("users").insert({
        username,
        password: hash,
      });
      const [newlyCreateUser] = await db("users").where("id", newUserId);
      res.status(201).json(newlyCreateUser);
    } catch (err) {
      res.json({ status: 500, message: err });
    }
  }
);

router.post("/login", credentialsRequired, async (req, res) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
  try {
    const { username, password } = req.body;
    const [user] = await db("users").where("username", username);
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = buildToken(user);
      res.json({ message: `welcome, ${user.username}`, token });
    } else {
      res.status(401).json({ message: "invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "something went wrong logging in" });
  }
});

function buildToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: "1d",
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

module.exports = router;
