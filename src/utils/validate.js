const validator = require("validator");
const bcrypt = require("bcrypt");

const validateSignUp = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Invalid Name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password not strong enough");
  }
};
const validateEditProfileData = (req) => {
  const editsAllowed = [
    "age",
    "gender",
    "firstName",
    "lastName",
    "skills",
    "about",
    "photoURL",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    editsAllowed.includes(field)
  );

  return isEditAllowed;
};

module.exports = { validateSignUp, validateEditProfileData };
