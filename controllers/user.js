// Import User model (connected with MongoDB via Mongoose + passport-local-mongoose)
const User = require("../models/user");

// ===============================
// SIGNUP PAGE (GET)
// ===============================
// Renders the signup form when user visits "/signup"
module.exports.userSignupPage = async (req, res) => {
  res.render("user/signIn.ejs", { title: "bookMyBrix | Sign Up" });
};

// ===============================
// SIGNUP (POST)
// ===============================
// Handles form submission when user tries to create a new account
module.exports.userSignup = async (req, res) => {
  try {
    // Extract username, email, password from form
    let { username, email, password } = req.body;

    // Create a new user object (without password yet)
    let newUser = new User({ username, email });

    // Passport-local-mongoose takes care of hashing & saving password
    let registerNewUser = await User.register(newUser, password);

    // Flash success message
    req.flash("success", `Welcome to BookMyBrix @${username}`);

    // Redirect user to login page after successful signup
    res.redirect("/login");
  } catch (e) {
    // If user already exists or error occurs → redirect back
    let { username } = req.body;
    req.flash("error", `User @${username} already exists`);
    res.redirect("/signup");
  }
};

// ===============================
// LOGIN PAGE (GET)
// ===============================
// Renders login form when user visits "/login"
module.exports.userLoginPage = (req, res) => {
  res.render("user/login.ejs", { title: "bookMyBrix | Log In" });
};

// ===============================
// LOGIN (POST)
// ===============================
// Passport.authenticate("local") middleware (in router) ensures only valid users reach here
module.exports.userLogin = async (req, res) => {
  let { username } = req.body;
  req.flash("success", `Welcome back @${username}`);
  res.redirect("/listing"); // Redirect to listings page after login
};

// ===============================
// LOGOUT
// ===============================
// Ends the user session and logs them out
module.exports.userLogOut = (req, res, next) => {
  req.logout((e) => {
    if (e) {
      return next(e); // Handle logout error
    }
    req.flash("success", "Logout successful!");
    res.redirect("/listing");
  });
};






























// const User = require("../models/user");

// module.exports.userSignupPage = async (req, res) => {
//   res.render("user/signIn.ejs", { title: "bookMyBrix | Sign Up" });
// };

// module.exports.userSignup = async (req, res) => {
//   try {
//     let { username, email, password } = req.body;
//     let newUser = new User({ username, email });
//     let registerNewUser = await User.register(newUser, password);
//     // console.log(registerNewUser);
//     req.flash("success", `Welcome to BookMyBrix @${username}`);
//     res.redirect("/login");
//   } catch (e) {
//     let { username } = req.body;
//     req.flash("error", `User @${username} already exits`);
//     res.redirect("/signup");
//   }
// };

// module.exports.userLoginPage = (req, res) => {
//   res.render("user/login.ejs", { title: "bookMyBrix | Log In" });
// };

// module.exports.userLogin = async (req, res) => {
//   let { username } = req.body;
//   req.flash("success", `Welcome back @${username}`);
//   res.redirect("/listing");
// };

// module.exports.userLogOut = (req, res, next) => {
//   req.logout((e) => {
//     if (e) {
//       return next(e);
//     }
//     req.flash("success", "Logout successful!");
//     res.redirect("/listing");
//   });
// };
