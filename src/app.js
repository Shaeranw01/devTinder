const express = require("express");
const { connectDb } = require("./config/database");
const User = require("./models/user");
const { validateSignUp } = require("./utils/validate");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const { initializeSocket } = require("./utils/socket");
const http = require("http");

const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);
// const server = http.createServer(app);
// initializeSocket(server);

connectDb()
  .then(() => {
    console.log("db connected");
    const server = http.createServer(app);
    initializeSocket(server);

    server.listen(3000, "127.0.0.1", () => {
      console.log("Server listening on 127.0.0.1:3000");
    });
  })
  .catch(() => {
    console.error("db not connected");
  });
