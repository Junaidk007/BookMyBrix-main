// controllers/reviews.js

const { Listing } = require("../models/listing");
const { Review } = require("../models/review");

/**
 * Create a new review for a listing
 * Route: POST /listing/:id/review
 */
module.exports.createReview = async (req, res, next) => {
  const { id } = req.params;

  // Find the listing where review should be added
  const listing = await Listing.findById(id);

  // Create a new review from form data
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id; // link review to logged-in user

  // Push review into the listing's reviews array
  listing.reviews.push(newReview);

  // Save both review and updated listing
  await newReview.save();
  await listing.save();

  // Redirect back to the listing page
  res.redirect(`/listing/${id}`);
};

/**
 * Delete a review from a listing
 * Route: DELETE /listing/:id/review/:reviewId
 */
module.exports.destroyReview = async (req, res, next) => {
  const { id, reviewId } = req.params;

  // Remove review reference from listing
  await Listing.findByIdAndUpdate(id, { 
    $pull: { reviews: reviewId }
  });

  // Delete the review document itself
  await Review.findByIdAndDelete(reviewId);

  // Redirect back to listing page (scroll to review section)
  res.redirect(`/listing/${id}/#review`);
};






























// const { Listing } = require("../models/listing");
// const { Review } = require("../models/review");

// module.exports.createReview = async (req, res, next) => {
//   let { id } = req.params;
//   let listing = await Listing.findById(id);
//   let newReview = new Review(req.body.review);
//   newReview.author = req.user._id;
//   listing.reviews.push(newReview);

//   await newReview.save();
//   await listing.save();

//   res.redirect(`/listing/${id}`);
// };

// module.exports.destroyReview = async (req,res,next) => {
//   let {id, reviewId} = req.params;
//   await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//   await Review.findByIdAndDelete(reviewId);
//   res.redirect(`/listing/${id}/#review`)
// }