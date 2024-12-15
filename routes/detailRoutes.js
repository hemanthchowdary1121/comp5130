const express = require("express")
const users = require('../model/userDetails.js')
const asyncHandler = require('express-async-handler')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { protect } = require('../middleware/detMiddleware.js');
const crypto = require('crypto');

const router = express();

// JWT generation function
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  };

  function generateShortCode(email) {
    return crypto.createHash('sha256').update(email).digest('base64').slice(0, 6);
}

router.post("/create-user", asyncHandler (async(req, res) => {
    const {firstname, secondname, email, password} = req.body

    if(!firstname || !secondname || !email || !password) {
        res.status(400)
        throw new Error('Please enter all the fields')
    }

    const userCheck = await users.findOne({email})

    if(userCheck) {
        res.status(400)
        throw new Error('User already exists')
    } else {
          // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const baseUrl = "http://localhost:5000"; // Replace with your base site URL
    const shortCode = generateShortCode(email);
    const shortUrl = `${baseUrl}/u/${shortCode}`;

        const newUser = await users.create ({firstname, secondname, email, password: hashedPassword, shortUrl})

        if(newUser){
            res.status(200).json({_id: newUser._id})

        }else {
            res.status(400)
            throw new Error('User was not created')
        }
    }


}))

router.post(
    "/login",
    asyncHandler(async (req, res) => {
      const { email, password } = req.body;
  
      // Check if the user exists
      const user = await users.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // If the user exists and the password is correct
        res.status(200).json({
          _id: user._id,
          token: generateToken(user._id), // Send JWT token to the client
        });
      } else {
        // Invalid credentials
        res.status(401);
        throw new Error("Invalid email or password");
      }
    })
  );
  
  router.get(
    "/get-user", 
    protect, 
    asyncHandler(async (req, res) => {
      const user = await users.findById(req.user._id);
  
      if (user) {
        res.status(200).json({
          _id: user._id,
          firstname: user.firstname,
          secondname: user.secondname,
          email: user.email,
        });
      } else {
        res.status(404);
        throw new Error("User not found");
      }
    })
  );
  

module.exports = router