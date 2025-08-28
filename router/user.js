// Importing required modules
const express = require("express");
const router = express.Router(); // Creates a mini Express router instance
const wrapAsync = require("../utils/wrapAsync"); // Utility to handle async errors
const passport = require("passport"); // Passport for authentication
const userController = require("../controllers/user"); // Controller with user-related logic

// ===============================
// USER SIGNUP ROUTES
// ===============================
router
  .route("/signup")
  // Show the signup page
  .get(wrapAsync(userController.userSignupPage))
  // Handle signup form submission (creating a new user in DB)
  .post(wrapAsync(userController.userSignup));

router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/signup", // if google auth fails
    failureFlash: true
  }),
  (req, res) => {
    // If successful, redirect to home (or listings)
    res.redirect("/listing");
  }
);

// ===============================
// USER LOGIN ROUTES
// ===============================
router
  .route("/login")
  // Show login page
  .get(userController.userLoginPage)
  // Handle login with Passport local strategy
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login", // If login fails → redirect back to login page
      failureFlash: true,        // Show flash message on failure
    }),
    wrapAsync(userController.userLogin) // If login succeeds → call controller logic
  );

// ===============================
// USER LOGOUT ROUTE
// ===============================
// Logout user and destroy session
router.get("/logout", userController.userLogOut);

// Export router so app.js can use it
module.exports = router;
























// const express = require("express");
// const router = express.Router();
// const wrapAsync = require("../utils/wrapAsync");
// const passport = require("passport");
// const userController = require("../controllers/user");

// router
//   .route("/signup")
//   .get(wrapAsync(userController.userSignupPage))
//   .post(wrapAsync(userController.userSignup));

// router
//   .route("/login")
//   .get(userController.userLoginPage)
//   .post(
//     passport.authenticate("local", {
//       failureRedirect: "/login",
//       failureFlash: true,
//     }),
//     wrapAsync(userController.userLogin)
//   );

// router.get("/logout", userController.userLogOut);

// module.exports = router;
