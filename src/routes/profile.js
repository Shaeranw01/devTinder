const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validate");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { sendSuccess, sendError } = require("../utils/response");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    sendSuccess(res, req.user);
  } catch (err) {
    sendError(res, "Error fetching profile: " + err.message, 400);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) throw new Error("Invalid edit request");

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    sendSuccess(
      res,
      loggedInUser,
      `${loggedInUser.firstName} edit was successful`
    );
  } catch (err) {
    sendError(res, err.message, 400);
  }
});

profileRouter.patch("/profile/editpassword", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const loggedInUser = req.user;

    if (!oldPassword || !newPassword) {
      throw new Error("both old and new password are required");
    }

    const isPasswordCorrect = await loggedInUser.validatePassword(oldPassword);
    if (!isPasswordCorrect) {
      throw new Error("Please try again.. your password is incorrect");
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("New password is not strong enough!!");
    }
    loggedInUser.password = bcrypt.hashSync(newPassword, 10);
    await loggedInUser.save();
    sendSuccess(res, null, "Password updated successfully");
  } catch (err) {
    sendError(res, err.message, 400);
  }
});
module.exports = profileRouter;
