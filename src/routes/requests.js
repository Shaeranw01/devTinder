const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
//only loggedin user can send con req
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + "sent connnection req");
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});
module.exports = requestRouter;
