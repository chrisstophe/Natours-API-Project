const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// Creating a user schema
const userSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: 'string',
    required: [true, 'Please tell us your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: 'string',
  },
  password: {
    type: 'string',
    required: [true, 'Please provide a password'],
    minlength: [8, 'A password must have greater or equal to 8 characters'],
  },
  passwordConfirm: {
    type: 'string',
    required: [true, 'Please confirm your password'],
    validate: {
      // This ONLY works on CREATE and SAVE!!
      validator: function (val) {
        // Confirm password matches
        return val === this.password;
      },
      message: `Passwords do not match! Please try again`,
    },
  },
});

// Middleware to encrypt passwords
userSchema.pre('save', async function (next) {
  // Check whether password was modified
  if (!this.isModified('password')) return next();

  // Async hashing using Bcrypt
  // The cost parameter is how CPU intensive the process will be and the better the encryption
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// Creating a user model out of the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
