const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://sharanw01_db_user:tQBpih1Zga9EeOol@masternode.tobfzeh.mongodb.net/devTinder"
  );
};
module.exports = { connectDb };
