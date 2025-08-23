const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

// Define User schema
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, // no duplicate emails allowed
    lowercase: true, // always save in lowercase
  },
});

// Add username + hashed password via Passport plugin
userSchema.plugin(passportLocalMongoose);

// Create User model
const User = mongoose.model("User", userSchema);

module.exports = User;
























// const { required } = require("joi");
// const mongoose = require("mongoose");
// const schema = mongoose.Schema;
// const passportLocalMongoose = require('passport-local-mongoose');

// const userSchema = new schema({
//     email: {
//         type: String,
//         required: true
//     }
// })

// userSchema.plugin(passportLocalMongoose);

// module.exports = mongoose.model("User", userSchema);

