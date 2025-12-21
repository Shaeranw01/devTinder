const User = require("../models/user");
const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  // we need to authorise teh admin first if we want them to access the data
  console.log("auth done");
  let token = "xyz";
  let isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send("u are unauthorized");
  } else next();
};
const userAuth = async (req, res, next) => {
  // if (req.method === "OPTIONS") {
  //   return next(); // 👈 allow preflight
  // }
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("You are not logged in!!!");
    }
    const decodedData = jwt.verify(token, "DevTinder@$&78788");
    const { _id } = decodedData;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("user not found!!");
    }
    //attaching the user to the request so it can be used by the rh which runs in next
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
};

module.exports = { adminAuth, userAuth };
