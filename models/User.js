const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');

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

//// Model static method
userSchema.statics.login = async function (email, password) {

  // find a data with the same email in db
  const user = await this.findOne({ email });

  // if user exists
  if (user) {

    // compare user entered password and password from database
    const auth = await bcrypt.compare(password, user.password);

    if (auth) {
      return user;
    } else throw Error('incorrect password') // if the password is not matched

  }
  throw Error('incorrect email') // if the email didn't found on the database
}

const User = mongoose.model('user', userSchema)
module.exports = User;