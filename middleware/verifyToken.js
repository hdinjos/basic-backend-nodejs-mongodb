const jwt = require("jsonwebtoken");
const SECRET = "changeme";

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token && token.includes("Bearer")) {
    try {
      const decodeToken = jwt.verify(token.slice(7), SECRET);
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

module.exports = verifyToken;
