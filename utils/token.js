const randToken = require("rand-token");
const jwt = require("jsonwebtoken");
const SECRET = "changeme";

const generateToken = (user) => {
  const token = jwt.sign(
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

const refreshTokenGen = () => randToken.uid(256);

module.exports = {
  generateToken,
  refreshTokenGen,
};
