const express = require("express");
const mongoose = require("mongoose");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionrequest");
const User = require("../models/user");
const { sendSuccess, sendError } = require("../utils/response");
const { sendEmail } = require("../utils/sendEmail");
//only loggedin user can send con req
requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return sendError(res, "Invalid status type", 400);
      }

      const messages = {
        interested: "Connection request sent",
        ignored: "User ignored",
      };

      //validating id of the user
      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return sendError(res, "Invalid user ID format", 400);
      }
      //creating a new instance of conn req model

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      //I have to also make sure that conn req is only sent to those users who already exist in DB

      const toUser = await User.findById(toUserId);
      if (!toUser) return sendError(res, "User does not exist", 404);
      //I have to also make sure that user b should not be able to send a request to user a if a has already sent a request
      //I have to also ensure that if user a has sent a request to b then it should not be able to do that again
      // I have to find in connection req database if such combinations exist already
      const existingUserRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingUserRequest)
        return sendError(res, "Connection request already exists", 409);

      const data = await connectionRequest.save();
      // Send email (v2 AWS SDK)
      try {
        const emailResponse = await sendEmail.run(
          "A new Connection Request",
          `You received a connection request from ${req.user.firstName}`
        );
        console.log("Email sent successfully:", emailResponse.MessageId);
      } catch (emailErr) {
        console.error("Error sending email:", emailErr.message || emailErr);
        // Do not block API response if email fails
      }
      sendSuccess(res, data, `Connection request ${status}`);
    } catch (err) {
      sendError(res, err.message, 500);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return sendError(res, "Invalid status type", 400);
      }
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest)
        return sendError(res, "Connection request not found", 400);

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      sendSuccess(res, data, `Connection request ${status}`);
    } catch (err) {
      sendError(res, err.message, 400);
    }
  }
);
module.exports = requestRouter;
