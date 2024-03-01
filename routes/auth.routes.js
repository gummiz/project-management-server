const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

// /auth/signup
router.post("/signup", (req, res, next) => {
  const { email, password, name } = req.body;

  // Check if the email or password or name is provided as an empty string
  if (email === "" || password === "" || name === "") {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // Use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // check if user exists in DB
  User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        // user exists in the DB
        res.status(400).json({ message: "User already exists" });
        return;
      }

       // create salt
       const salt = bcrypt.genSaltSync(10);

       // create hash
       const hashedPassword = bcrypt.hashSync(password, salt);
    
 
       const newUser = {
         email: email,
         name: name,
         password: hashedPassword,
       };
 
       return User.create(newUser);
    })
    .then((createdUser) => {
        res.status(200).json(createdUser)
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "internal server error" });
    });
});

module.exports = router;
