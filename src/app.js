const express = require("express");
const app = express();
app.use("/test", (req, res) => {
  res.send("hello from server");
});

app.use("/login", (req, res) => {
  res.send("this is the login page with nodemon....");
});
app.use("/", (req, res) => {
  res.send("this is the homepage nodemon");
});
app.listen(3000, () => {
  console.log("server listening on port 3000...");
});
