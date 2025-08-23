const mongoose = require("mongoose");
const { Review } = require("./review");
const Schema = mongoose.Schema;

// Define Listing schema
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1500, // enforce max length for description
  },
  price: {
    type: Number,
    required: true,
    min: 0, // prevent negative prices
  },
  image: {
    url: String,
    filename: String,
  },
  location: String,
  country: String,

  // Array of references to Review documents
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  // Reference to the owner (User model)
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  // GeoJSON format for Mapbox
  geometry: {
    type: {
      type: String,
      enum: ["Point"], // must always be a GeoJSON "Point"
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
});

// Cascade delete: remove reviews if listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

// Create Listing model
const Listing = mongoose.model("Listing", listingSchema);

module.exports = { listingSchema, Listing };


































// const mongoose = require("mongoose");
// const schema = mongoose.Schema;
// const {Review} = require("./review");

// const listingSchema = new schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//     MaxLength: 1500,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   image: {
//     url: String,
//     filename: String
//   },
//   location: String,
//   country: String,
//   reviews: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Review"
//     }
//   ],
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   },  
//   geometry: {
//     type: {
//       type: String, // Don't do `{ location: { type: String } }`
//       enum: ['Point'], // 'location.type' must be 'Point'
//       required: true
//     },
//     coordinates: {
//       type: [Number],
//       required: true
//     }
//   }
// });

// listingSchema.post("findOneAndDelete", async (listing) => {
//   if (listing) {
//     await Review.deleteMany({_id: {$in : listing.reviews}})
//   }
// })

// const Listing = mongoose.model("Listing", listingSchema);

// module.exports = {
//   listingSchema,
//   Listing
// };
