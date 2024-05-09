const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  // const {name,email,password} = req.body
  // const salt = await bcrypt.genSalt(10)
  // const hashPassword = await bcrypt.hash(password,salt)
  // const tempUser = {name,email,password:hashPassword}
  const user = await User.create({...req.body}); //create a user
  const token = user.createJWT(); //create a token for user
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Provide email and password");
  }

  const user = await User.findOne({ email }); // returns the document

  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  
  const checkPassword = await user.checkPassword(password) //return boolean
  
  if (!checkPassword) {
    throw new UnauthenticatedError("Incorrect password");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
