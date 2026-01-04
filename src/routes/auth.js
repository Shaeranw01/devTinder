const express = require("express");
const authRouter = express.Router();
const { validateSignUp } = require("../utils/validate");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { sendSuccess, sendError } = require("../utils/response");

authRouter.post("/signup", async (req, res) => {
  try {
    //validate sign up data
    validateSignUp(req);

    //encrypt pwd
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    //creating a new instance of User Model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    //   //user.save always return a promise
    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600000),
    });

    sendSuccess(res, savedUser, "User signed up successfully");
  } catch (err) {
    sendError(res, "Error saving the user: " + err.message, 400);
  }
});

//login
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    console.log("Login body:", req.body);
    const user = await User.findOne({ emailId: emailId });
    if (!user) return sendError(res, "Invalid credentials", 401);

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) return sendError(res, "Invalid credentials", 401);

    const token = await user.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600000),
    });

    sendSuccess(res, user, "Login successful");
  } catch (err) {
    sendError(res, "Error in login: " + err.message, 500);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("User logged out!!");
});
module.exports = authRouter;
