// ===============================
// middleware.js
// ===============================
// This file contains custom middleware functions for:
// 1. Request validation (using Joi)
// 2. Authentication (check if user is logged in)
// 3. Authorization (check if user owns a resource)
// 4. Setting dynamic navbar links based on login state
// ===============================

const { Listing } = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { listingSchema: joiListingSchema, reviewSchema: joiReviewSchema } = require("./schema");

// ===============================
// Middleware: Validate Listing Input
// ===============================
const validateListing = (req, res, next) => {
  let { error } = joiListingSchema.validate(req.body);

  if (error) {
    // Collect error messages from Joi
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next(); // continue if validation passed
  }
};

// ===============================
// Middleware: Validate Review Input
// ===============================
const validateReview = (req, res, next) => {
  let { error } = joiReviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// ===============================
// Middleware: Check if User is Logged In
// ===============================
const isLogedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Please login first!");
    return res.redirect("/login");
  }
  next();
};

// ===============================
// Middleware: Dynamic Navbar Links
// ===============================
// Sets res.locals values so EJS templates know
// which link to show in navbar ("Sign Up / Log In" or "Log Out").
function setNavbar(req, res, next) {
  if (!req.isAuthenticated()) {
    res.locals.link = "/signup";
    res.locals.linkname = "Sign Up / Log In";
  } else {
    res.locals.link = "/logout";
    res.locals.linkname = "Log Out";
  }
  next();
}

// ===============================
// Middleware: Check if Current User Owns the Listing
// ===============================
const isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listing");
  }

  // Check if the current user is the owner
  if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/listing/${id}`);
  }

  next();
};

// ===============================
// Exports
// ===============================
module.exports = {
  isLogedIn,
  setNavbar,
  isOwner,
  validateListing,
  validateReview,
};




























// const {Listing} = require("./models/listing");
// const ExpressError = require("./utils/ExpressError");
// const { listingSchema: joiListingSchema, reviewSchema: joiReviewSchema } = require("./schema");

// const validateListing = (req, res, next) => {
//   let { error } = joiListingSchema.validate(req.body);

//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };

// const validateReview = (req,res,next) => {
//   let {error} = joiReviewSchema.validate(req.body);

//   if(error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// }

// const isLogedIn = (req, res, next) => {
//   if (!req.isAuthenticated()) {
//     req.flash("error", "Please login first!");
//     return res.redirect("/login");
//   }
//   next();
// };

// function setNavbar(req, res, next) {
//   // res.locals.title = "BookMyBrix";
//   if (!req.isAuthenticated()) {
//     res.locals.link = "/signup";
//     res.locals.linkname = "Sign Up / Log in";
//   } else {
//     res.locals.link = "/logout";
//     res.locals.linkname = "Log Out";
//   }
//   next();
// }

// const isOwner = async (req, res, next) => {
//   let { id } = req.params;
//   let listing = await Listing.findById(id)
//   if (!res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)) {
//     if(!res.locals.currUser) {
//       req.flash("error", "Please login first!");
//     }
//       req.flash("error", "You don't have access for this!");
//     return res.redirect(`/listing/${id}`);
//   }

//   next()
// };

// module.exports = {
//   isLogedIn,
//   setNavbar,
//   isOwner,
//   validateListing,
//   validateReview
// };
