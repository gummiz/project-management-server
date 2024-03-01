const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken") 
require("dotenv/config")

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


// Login
router.post("/login", (req, res, next) =>{


    const { email, password} = req.body

      // Check if the email or password is provided as an empty string
  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password" });
    return;
  }

    User.findOne({email})
    .then((foundUser) => {
        if(!foundUser) {
            res.status(404).json({message: "User not found."})
        } 
        
        //check if provided password is correct witht the one in the DB: compareSync(s, hash)
        const passwordCorrect = bcrypt.compareSync(password, foundUser.password)
        
        if (passwordCorrect) {

             // Deconstruct the user object to omit the password
            const { _id, email, name } = foundUser

            // Create an object that will be set as the token payload
            const payload = { _id, email, name }

            // create and sign the tolen
            const authToken = jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                { algorithm: "HS256", expiresIn: "6h"}
            )



            res.json({authToken: authToken})
        } else {
            res.status(404).json({message: `wrong Password`})
        }
    }).catch((err) => {
        res.status(500).json({ message: "internal server error" });
    });


})


module.exports = router;
