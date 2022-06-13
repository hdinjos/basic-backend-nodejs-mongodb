const express = require("express");
const User = require("../../model/User");
const Token = require("../../model/Token");
const { generateToken, refreshTokenGen } = require("../../utils/token");
const { checkPassword, hashPassword } = require("../../utils/password");
const router = express.Router();

router.post("/login", async (req, res) => {
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
      message: "Invalid Email/Password",
    });
  }
  const accessToken = generateToken(user);
  const refreshToken = refreshTokenGen(user);
  const storedRefreshToken = new Token({ refreshToken, user: user._id });
  await storedRefreshToken.save();

  res.json({
    accessToken,
    refreshToken,
  });
});

router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const hashedPassword = await hashPassword(password);
  const userData = {
    email,
    firstName,
    lastName,
    password: hashedPassword,
  };

  const existingUser = await User.findOne({ email }).lean();

  if (existingUser) {
    return res.status(400).json({
      message: "Email already exists",
    });
  }

  const user = new User(userData);
  const savedUser = await user.save();

  if (savedUser) {
    const accessToken = generateToken(savedUser);
    const refreshToken = refreshTokenGen();
    const storedRefreshToken = new Token({ refreshToken, user: savedUser._id });
    await storedRefreshToken.save();

    return res.status(200).json({
      message: "User created successfully",
      accessToken,
      refreshToken,
    });
  }
});

router.post("/refreshToken", async (req, res) => {
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

module.exports = router;
