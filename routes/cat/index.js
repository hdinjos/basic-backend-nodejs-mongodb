const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/cat", async (req, res) => {
  const response = await axios.get("https://cataas.com/cat", {
    responseType: "arraybuffer",
  });
  let raw = Buffer.from(response.data).toString("base64");
  res.json({
    image: "data:" + response.headers["content-type"] + ";base64," + raw,
  });
});

module.exports = router;
