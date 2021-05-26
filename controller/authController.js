const User = require("../models/User");
const cookie = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY; 
const MAX_AGE = 3 * 24 * 60 * 60;

// Handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };


  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'That email is already registered';
    return errors;
  }


  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}

// Create JWT token
const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET_KEY, {
    expiresIn: MAX_AGE
  });
}

//// Controllers

// Log in page
module.exports.loginGet = (req, res) => {
  res.render('login')
};

// Log in post
module.exports.loginPost = (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  res.send('login');
};

// Sign up page
module.exports.signupGet = (req, res) => {
  res.render('signup')
};

// Sign up post
module.exports.signupPost = async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, {httpOnly: true, maxAge: MAX_AGE * 1000});
    res.status(201).json(user).send();

  } catch (err) {

    error = handleErrors(err);
    res.statusCode = 401;
    res.json({ error });

  }

  res.send();
};
