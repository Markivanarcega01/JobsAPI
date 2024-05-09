const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = (req, res, next) => {
  //check header

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET); 
    // iverify yung token para makalogin or maaccess yung jobs api
    //const user = User.findById(payload.userID).select('-password')
    //req.user = user

    req.user = { userID: payload.userID, name: payload.name };
    // after the jwt.verify the token will turn back to an object na pwedeng magamit sa jobs api
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = auth;
