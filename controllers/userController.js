const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const userAlreadyExist = await userModel.findOne({ email });

  if (userAlreadyExist) {
    res.status(400);
    throw new Error("Email has been taken");
  }

  const user = await userModel.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the user, kindly try again");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userDetails = await userModel.findOne({ email });

  if (userDetails && (await userDetails.matchPassword(password))) {
    res.status(201).json({
      _id: userDetails._id,
      name: userDetails.name,
      email: userDetails.email,
      pic: userDetails.pic,
      token: generateToken(userDetails._id),
    });
  } else {
    res.status(401);
    throw new Error("Either email or password is invalid");
  }
});

module.exports = { registerUser, authUser };
