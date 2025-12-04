const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
console.log(adminAuth);
const app = express();

//it is not a good practice to write auth code again and ahain

// app.get("/admin/getData", (req, res) => {
//   // we need to authorise teh admin first if we want them to access the data
//   let token = "xyz";
//   let isAuthorized = token === "xyz";
//   if (isAuthorized) {
//     res.send("read all data");
//   } else res.status(401).send("u are unauthorized");
// });
// app.get("/admin/deleteData", (req, res) => {
//   // we need to authorise teh admin first if we want them to delete the data
//   let token = "xyz";
//   let isAuthorized = token === "xyz";
//   if (isAuthorized) {
//     res.send("delete all data");
//   } else res.status(401).send("u are unauthorized");
// });

//using app.use => handle auth middlewate for get,post,put,patch,delete
//auth done for all /admin routes
app.use("/admin", adminAuth);

app.get("/user/data", userAuth, (req, res) => {
  res.send("read user data");
});
//if no auth needed we can skip userAuth
app.get("/user/login", (req, res) => {
  res.send("login");
});
app.get("/admin/getData", (req, res) => {
  res.send("read all data");
});
app.get("/admin/deleteData", (err, req, res, next) => {
  try {
    throw new Error("gg");
    res.send("delete all data");
  } catch (err) {
    res.status(500).send("something went wrong");
  }
});
// app.use for error handling should always be at the end
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});

//get all users with an email
// app.get("/user", async (req, res) => {
//   try {
//     const users = await User.find({ emailId: req.body.emailId });
//     if (users.length === 0) {
//       res.status(404).send("user not found");
//     } else {
//       res.send(users);
//     }
//   } catch {
//     res.status(400).send("something went wrong");
//   }
// });
//get one user with emailId
app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    if (!user) {
      res.status(404).send("user not found");
    } else {
      res.send(user);
    }
  } catch {
    res.status(400).send("something went wrong");
  }
});

//get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch {
    res.status(400).send("something went wrong");
  }
});
//delete a user from database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  console.log(req.body);
  try {
    await User.findByIdAndDelete(userId);
    res.send("user deleted successfully");
  } catch {
    res.status(400).send("something went wrong");
  }
});
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["about", "photoURL", "gender", "skills"];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );
    if (data?.skills.length > 10) {
      throw new Error("more than 10 skills are not allowed");
    }
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send("UPDATE FAILED" + err.message);
  }
});

app.listen(1414, () => {
  console.log("listening to port 1414");
});
