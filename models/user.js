const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

// Define User schema
const userSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: false, // ✅ not forcing unique, to support Google + Local separately
  },
  googleId: {
    type: String, // ✅ store Google’s unique ID
    unique: true, // each Google account is unique
    sparse: true, // allow null for local users
  },
  profilePic: {
    type: String, // optional, Google profile photo URL
    default: "/images/fallback_img.jpeg"
  },
});

// Add username + hashed password via Passport plugin
userSchema.plugin(passportLocalMongoose);

// Create User model
const User = mongoose.model("User", userSchema);

module.exports = User;