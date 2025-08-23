// routes/review.js
const express = require("express");
const router = express.Router({ mergeParams: true });

// Utilities & Middleware
const wrapAsync = require("../utils/wrapAsync");
const { isLogedIn, isOwner, validateReview } = require("../middleware");

// Controller (actual logic)
const reviewController = require("../controllers/reviews");

/**
 * POST /listing/:id/review
 * Create a new review for a listing
 * Middlewares:
 *  - validateReview: validate incoming review (Joi)
 *  - isLogedIn: only logged-in users can post
 */
router.post(
  "/",
  validateReview,
  isLogedIn,
  wrapAsync(reviewController.createReview)
);

/**
 * DELETE /listing/:id/review/:reviewId
 * Delete a review from a listing
 * Middlewares:
 *  - isOwner: only review owner can delete
 */
router.delete(
  "/:reviewId",
  isOwner,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;






























// const express = require("express");
// const router = express.Router({mergeParams: true});
// const wrapAsync = require("../utils/wrapAsync");
// const { isLogedIn, isOwner, validateReview } = require("../middleware");
// const reviewController = require("../controllers/reviews");

// router.post("/", validateReview, isLogedIn,
//   wrapAsync(reviewController.createReview)
// );

// router.delete("/:reviewId",isOwner , wrapAsync(reviewController.destroyReview))

// module.exports = router;