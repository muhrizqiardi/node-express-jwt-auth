const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const {isEmail} = require('validator');

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"]
  }
});

//// Mongoose hooks
// Fire a function before doc saved to db
// Hash password before saving to DB
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  console.log("user is about to be created", this)
  next();
});
// Fire a function after doc saved to db
userSchema.post('save', function (doc, next) {
  console.log("new user created", doc);
  next();
});

const User = mongoose.model('user', userSchema)
module.exports = User;