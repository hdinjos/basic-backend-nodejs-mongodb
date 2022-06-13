const express = require("express");
const jwtDecode = require("jwt-decode");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const randToken = require("rand-token");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("express-jwt");
const axios = require("axios");
const item = require("./routes/item");

const app = express();
const port = 3000;

const SECRET = "changeme";

const User = require("./model/User");
const Token = require("./model/Token");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const generateToken = (user) => {
  const token = jsonwebtoken.sign(
    {
      id: user._id,
      email: user.email,
      fullName: user.firstName + " " + user.lastName,
    },
    SECRET,
    {
      expiresIn: "1m",
    }
  );

  return token;
};

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) reject(err);
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  });
};

const checkPassword = (password, hash) => bcrypt.compare(password, hash);

const getRefreshToken = () => randToken.uid(256);

// API ENDPOINTS

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      message: "User not found!",
    });
  }
  const isPasswordValid = await checkPassword(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid password!",
    });
  }
  const accessToken = generateToken(user);
  const decodedAccessToken = jwtDecode(accessToken);
  const accessTokenExpiresAt = decodedAccessToken.exp;
  const refreshToken = getRefreshToken(user);

  const storedRefreshToken = new Token({ refreshToken, user: user._id });
  await storedRefreshToken.save();

  res.json({
    accessToken,
    expiresAt: accessTokenExpiresAt,
    refreshToken,
  });
});

app.post("/api/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const hashedPassword = await hashPassword(password);
  const userData = {
    email: email,
    firstName: firstName,
    lastName: lastName,
    password: hashedPassword,
  };

  const existingUser = await User.findOne({ email: email }).lean();

  if (existingUser) {
    return res.status(400).json({
      message: "Email already exists",
    });
  }

  const user = new User(userData);
  const savedUser = await user.save();

  if (savedUser) {
    const accessToken = generateToken(savedUser);
    const decodedToken = jwtDecode(accessToken);
    const expiresAt = decodedToken.exp;

    return res.status(200).json({
      message: "User created successfully",
      accessToken,
      expiresAt,
      // refreshToken: createRefreshToken(savedUser),
      refreshToken: getRefreshToken(),
    });
  }
});

app.post("/api/refreshToken", async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const user = await Token.findOne({ refreshToken }).select("user");

    if (!user) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    const existingUser = await User.findOne({ _id: user.user });

    if (!existingUser) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    const token = generateToken(existingUser);
    return res.json({ accessToken: token });
  } catch (err) {
    return res.status(500).json({ message: "Could not refresh token" });
  }
});

const attachUser = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token && token.includes("Bearer")) {
    try {
      const decodeToken = jsonwebtoken.verify(token.slice(7), SECRET);
      req.user = decodeToken;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Expired token" });
      }
      return res.status(401).json({ message: "Invalid Token" });
    }
  } else {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

app.use(attachUser);

const requireAuth = jwt({
  secret: SECRET,
  algorithms: ["HS256"],
});

app.get("/api/cat", requireAuth, async (req, res) => {
  const response = await axios.get("https://cataas.com/cat", {
    responseType: "arraybuffer",
  });
  let raw = Buffer.from(response.data).toString("base64");
  res.json({
    image: "data:" + response.headers["content-type"] + ";base64," + raw,
  });
});

app.use("/api", item);

app.get("/api/users", async (req, res) => {
  try {
    const user = await User.find({});
    res.json({
      success: 200,
      data: user.map((user) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      })),
    });
  } catch (err) {
    return res.status(500).json({ message: "available some problem" });
  }
});

async function connect() {
  try {
    mongoose.Promise = global.Promise;
    await mongoose.connect("mongodb://localhost:27017/mydb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.log("Mongoose error", err);
  }
  app.listen(port);
  console.log(`Server listening on port ${port}`);
}

connect();
