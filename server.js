const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const auth = require("./routes/auth");
const privateRoute = require("./utils/getRoute");

const app = express();
const port = 3000;

const verifyToken = require("./middleware/verifyToken");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// API PUBLIC
app.use("/api", auth);

app.use(verifyToken);

// API PRIVATE
privateRoute(app);

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
