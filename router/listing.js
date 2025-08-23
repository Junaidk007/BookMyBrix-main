// Import required modules
const express = require("express");
const router = express.Router(); // Create a new router object
const wrapAsync = require("../utils/wrapAsync"); // Utility to handle async errors
const { isLogedIn, isOwner, validateListing } = require("../middleware"); 
// Custom middlewares:
// isLogedIn -> checks if user is logged in
// isOwner -> checks if current user owns the listing
// validateListing -> validates input data with Joi schema

const listingController = require("../controllers/listing"); // Controller with business logic for listings
const multer = require("multer");
const { storage } = require("../cloudConfig"); // Cloudinary storage config
const upload = multer({ storage }); // Multer middleware for file uploads (stores images)

// ------------------ Routes ------------------

// "/" → Show all listings OR Create a new listing
router
  .route("/")
  // GET /listing → Show all listings
  .get(wrapAsync(listingController.index))
  
  // POST /listing → Create a new listing (only for logged-in users)
  .post(
    isLogedIn, // Middleware → ensures only logged-in users can post
    upload.single("listing[image]"), // Middleware → upload one image from form field "listing[image]"
    validateListing, // Middleware → validate data before saving
    wrapAsync(listingController.createListing) // Controller → save new listing
  );

// "/new" → Form for creating a new listing
router.get("/new", isLogedIn, listingController.newListingForm);

// "/search" → Search listings by location/price/etc.
router.get("/search", wrapAsync(listingController.searchListing));

// "/:id" → Show, Update, or Delete a specific listing
router
  .route("/:id")
  // GET /listing/:id → Show a single listing (details page)
  .get(wrapAsync(listingController.individualListing))

  // PUT /listing/:id → Update listing (only if logged-in & owner)
  .put(
    isLogedIn, // Must be logged in
    isOwner, // Must be owner of the listing
    upload.single("listing[image]"), // Handle updated image upload
    validateListing, // Validate updated data
    wrapAsync(listingController.updateListing) // Controller → update listing
  )

  // DELETE /listing/:id → Delete listing (only if logged-in & owner)
  .delete(
    isLogedIn, 
    isOwner, 
    wrapAsync(listingController.destroyListing) // Controller → delete listing
  );

// "/:id/edit" → Form to edit an existing listing
router.get(
  "/:id/edit",
  isLogedIn, // Must be logged in
  isOwner,   // Must be owner of the listing
  wrapAsync(listingController.listingEditForm) // Controller → show edit form
);

// Export router so it can be used in app.js
module.exports = router;








































// const express = require("express");
// const router = express.Router();
// const wrapAsync = require("../utils/wrapAsync");
// const { isLogedIn, isOwner, validateListing } = require("../middleware");
// const listingController = require("../controllers/listing");
// const multer = require("multer");
// const { storage } = require("../cloudConfig");
// const upload = multer({ storage });

// // implementing Router.route with controller

// router
//   .route("/")
//   .get(wrapAsync(listingController.index))
//   .post(
//     isLogedIn,
//     upload.single("listing[image]"),
//     validateListing,
//     wrapAsync(listingController.createListing)
//   );

// // create route
// router.get("/new", isLogedIn, listingController.newListingForm);

// router.get("/search", wrapAsync(listingController.searchListing));

// router
//   .route("/:id")
//   .get(wrapAsync(listingController.individualListing))
//   .put(
//     isLogedIn,
//     isOwner,
//     upload.single("listing[image]"),
//     validateListing,
//     wrapAsync(listingController.updateListing)
//   )
//   .delete(isLogedIn, isOwner, wrapAsync(listingController.destroyListing));

// router.get(
//   "/:id/edit",
//   isLogedIn,
//   isOwner,
//   wrapAsync(listingController.listingEditForm)
// );

// module.exports = router;
