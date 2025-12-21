const mongoose = require("mongoose");

const connectRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["accepted", "rejected", "ignored", "interested"],
        message: `{VALUE} is not a valid type`,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
//compound index for fast search
connectRequestSchema.index({ fromUserId: 1, toUserId: 1 });
//this method is called before every time .save() is called for connectionreq db
// it is to prevent a user from sending a connection req to himself
connectRequestSchema.pre("save", function () {
  let connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cannot send a connection request to yourself!!");
  }
});
const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequestModel",
  connectRequestSchema
);

module.exports = ConnectionRequestModel;
