const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // If jwt token exists & is verified
  if (token) {
    jwt.verify(token, JWT_SECRET_KEY, (err, decodedToken) => {
      if (err) {
        // If an error happened
        console.log(err.message);
        res.redirect('/login');
      } else {
        // If token is decoded
        console.log(decodedToken)
        next();
      }
    });
  } else {
    // redirect to login
    res.redirect('/login')
  }
};

// Check current user
const checkUser = (req, res, next) => {

  const token = req.cookies.jwt;

  // If token exists and verified
  if (token) {

    jwt.verify(token, JWT_SECRET_KEY, async (err, decodedToken) => {

      if (err) {

        // If an error happened
        console.log(err.message);
        res.locals.user = null;
        next();

      } else {

        // If token is decoded
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();

      }
      
    });

  } else {

    res.locals.user = null;
    next();

  }
}


module.exports = { requireAuth, checkUser };

