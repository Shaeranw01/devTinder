const express = require("express");
const { connectDb } = require("./config/database");
const User = require("./models/user");
const { validateSignUp } = require("./utils/validate");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const app = express();
app.use(express.json());
app.use(cookieParser());
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
connectDb()
  .then(() => {
    console.log("db connected");
    app.listen(3000, () => {
      console.log("server listening on port 3000...");
    });
  })
  .catch(() => {
    console.error("db not connected");
  });
