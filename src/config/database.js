const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://sharanw01_db_user:Yf2ziSIdUpIeMW8B@masternode.tobfzeh.mongodb.net/devTinder"
  );
};
module.exports = { connectDb };
