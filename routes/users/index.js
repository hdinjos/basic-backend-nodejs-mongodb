const express = require("express");
const User = require("../../model/User");
const router = express.Router();

router.get("/users", async (req, res) => {
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

module.exports = router;
