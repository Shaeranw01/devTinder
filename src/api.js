const express = require("express");
const app = express();

app.use(express.json()); // to read JSON body

// Temporary in-memory "database"
let users = [
  { id: 1, name: "John" },
  { id: 2, name: "Mary" },
];

//all these give the same result
//app.use("/route", rh1,rh2, rh3,rh4,rh5)
//app.use("/route", [rh1,rh2, rh3,rh4,rh5])
//app.use("/route", rh1,[rh2, rh3],rh4,rh5)

// if route=/ express will check all routes which start with / and will give the response from the rh which successully sends the response.-> middleware chaining, if no successful response error is cannot get
//if route=/user express will send resp from route=/ if there is a succesfful response here

// / route handles ALL paths but if  doesn’t send response → error cannot get

// /login only handles /login exactly

// / and /login are separate, not connected

// Calling next() in / does NOT magically move to /login

// After res.send(), DO NOT call next()
// The request is finished.
// Calling next() after that breaks your response.

//A route is executed ONLY if its path matches the request path.

//You requested /
//But the next route is /login
//So Express checks:"/".startsWith("/login") ?
//No.
//So Express skips /login.

//from eherer we are finally getting res is rh, others are middleware

app.use("/", (req, res, next) => {
  //   res.send("first route res");
  next();
});

app.get(
  "/login",
  (req, res, next) => {
    console.log("login1");
    next();
  },
  (req, res, next) => {
    console.log("login2");
    // res.send("login2");
    next();
  },
  (req, res, next) => {
    res.send("login3");
    // next();
  }
);
//Cannot GET /login -this error when we have next( ) in the last rh
//infinite loading when even no next in last rh
app.use("/test", (req, res, next) => {
  //   res.send("test1");
  next();
});
app.use("/test", (req, res, next) => {
  res.send("test2");
  //   next();
});

//read data
app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:userId", (req, res) => {
  let user = users.find((u) => u.id === Number(req.params.userId));
  if (!user) res.status(404).send("User not found");
  res.json(user);
});

app.post("/users", (req, res) => {
  const newUser = {
    id: 3,
    name: "Maria",
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.patch("/users/:id", (req, res) => {
  let user = users.find((u) => u.id === Number(req.params.id));
  if (!user) res.status(404).send("User not found");
  console.log("body", req.body);
  if (req.body.name) user.name = req.body.name;
  res.json(user);
});

//PUT → Replace entire user

app.put("/users/:id", (req, res) => {
  let userIndex = users.findIndex((u) => u.id === Number(req.params.id));
  users[userIndex] = {
    id: Number(req.params.id),
    name: req.body.name,
  };

  res.json(users[userIndex]);
});

app.delete("/users/:id", (req, res) => {
  users = users.filter((u) => u.id !== Number(req.params.id));
  res.json(users);
});
app.listen(1111, () => {
  console.log("listening to port 1111");
});
