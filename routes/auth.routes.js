const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/isAuthenticated")
const User = require("../models/user-model");

const router = express.Router();
const saltRounds = 10;

// AUTH ROUTES

// POST /auth/signup - Creates a new user in the database
router.post("/auth/signup", (req, res, next) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        res.status(400).json({ message: "Provide name,email and password" });
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Provide a valid email address.' });
        return;
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
        res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }

    User.findOne({ email })
        .then((foundUser) => {

            if (foundUser) {
                res.status(400).json({ message: "User already exists." });
                return;
            }

            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);

            const newUser = {
                email: email,
                password: hashedPassword,
                name: name
            };
            return User.create(newUser);
        })
        .then((createdUser) => {
            const { email, name, _id } = createdUser;
            const user = { email, name, _id };
            res.status(201).json({ user: user });
        })
        .catch(err => {
            console.log("Error trying to create an account...");
            console.log(err)
            res.status(500).json({ message: "Internal Server Error" })
        });
});
// POST /auth/login - Checks the sent email and password and, if email and password are correct returns a JWT
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(401).json({ message: "User not found." })
        return;
      }

      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
      if (passwordCorrect) {
        const { _id, email, name } = foundUser;
        const payload = { _id, email, name };
        const authToken = jwt.sign(
          payload,
          process.env.TOKEN_SECRET,
          { algorithm: 'HS256', expiresIn: "6h" }
        );
        res.json({ authToken: authToken });
      }
      else {
        res.status(401).json({ message: "Unable to authenticate the user" });
        return;
      }
    })
    .catch(err => {
      console.log("Error trying to login...");
      console.log(err)
      res.status(500).json({ message: "Internal Server Error" })
    });
});
// GET /auth/verify - Verifies that the JWT sent by the client is valid
router.get('/verify', isAuthenticated, (req, res, next) => {
  console.log(`req.payload`, req.payload);
  res.json(req.payload);
});

//USER ROUTES

// GET /api/users/:id - Retrieves a specific user by id. The route should be protected by the authentication middleware
router.get("/api/users/:id",isAuthenticated,(req,res,next)=>{
    const {id} = req.params;

    User.findById(id)
    .select("password")
    .then(user=>{
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.json(user);
    })
    .catch(err =>{
        console.log("Error getting user")
        console.log(err)
        res.status(500).json({message:"Internal server Error"});
    });
});
module.exports = router;