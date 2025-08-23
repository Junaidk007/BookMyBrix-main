const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Review schema
const reviewSchema = new Schema(
  {
    comment: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5, // enforce rating between 1–5
      required: true,
    },
    // Reference to the author (User model)
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

// Create Review model
const Review = mongoose.model("Review", reviewSchema);

module.exports = { reviewSchema, Review };




















// const mongoose = require("mongoose");
// const schema = mongoose.Schema;

// const  reviewSchema = schema({
//     comment: String,
//     rating: {
//         type: Number,
//         min: 1,
//         max: 5
//     },
//     author: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     }
    
// }, {timestamps: true});

// const Review = mongoose.model("Review", reviewSchema);

// module.exports = {
//     reviewSchema,
//     Review
// }