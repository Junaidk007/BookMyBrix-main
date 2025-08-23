// controllers/listing.js
// ===================================================================
// Handles all logic related to listings (CRUD, search, etc.)
// Connected with: routes/listing.js
// Uses: models/listing.js, utils/wrapAsync.js, middleware.js, cloudConfig.js
// ===================================================================

const {Listing} = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const { cloudinary } = require("../cloudConfig");

// Initialize Mapbox geocoding client using API key from .env
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

/* ==============================================================
   INDEX - Show all listings
   Route: GET /listing
   Used in: Homepage listings page
============================================================== */
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listing/index", { allListings,  title: "bookMyBrix | All listings" },);
};

/* ==============================================================
   NEW LISTING FORM
   Route: GET /listing/new
   Middleware: isLoggedIn
============================================================== */
module.exports.newListingForm = (req, res) => {
  res.render("listing/new", { title: "bookMyBrix | New listing" });
};

/* ==============================================================
   CREATE NEW LISTING
   Route: POST /listing
   Middleware: isLoggedIn, multer (upload), validateListing
============================================================== */
module.exports.createListing = async (req, res) => {
  // 1. Geocode location (convert city name → coordinates)
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  // 2. Extract uploaded image details (Cloudinary)
  let image = req.file.path;
  let filename = req.file.filename;

  // 3. Create new listing
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // logged-in user becomes owner
  newListing.image = { url: image, filename };
  newListing.geometry = response.body.features[0].geometry;

  // 4. Save to database
  await newListing.save();

  // 5. Redirect with flash message
  req.flash("success", "New Listing Created!");
  res.redirect("/listing");
};

/* ==============================================================
   SHOW INDIVIDUAL LISTING
   Route: GET /listing/:id
============================================================== */
module.exports.individualListing = async (req, res) => {
  const { id } = req.params;

  // Populate reviews & owner details
  const list = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!list) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listing");
  }

  res.render("listing/show", { list, token: process.env.MAP_TOKEN, title: `bookMyBrix | ${list.title}` });
};

/* ==============================================================
   EDIT FORM
   Route: GET /listing/:id/edit
   Middleware: isLoggedIn, isOwner
============================================================== */
module.exports.listingEditForm = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Requested page not found!");
    res.redirect("/listing");
  }

  let orgImageUrl = list.image.url;
  orgImageUrl = orgImageUrl.replace("/upload", "/upload/h_250,w_300");

  res.render("listing/edit", {
    list,
    orgImageUrl,
    title: "bookMyBrix | Edit listing",
  });
};

/* ==============================================================
   UPDATE LISTING
   Route: PUT /listing/:id
   Middleware: isLoggedIn, isOwner, multer (upload), validateListing
============================================================== */
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  // Update listing with new data
  let list = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // If new image uploaded, replace old one
  if (req.file) {
    let image = req.file.path;
    let filename = req.file.filename;

    // Delete old image from Cloudinary
    await cloudinary.uploader.destroy(list.image.filename);

    // Set new image
    list.image = { url: image, filename };
  }

  // If new location provided, geocode it
  if (req.body.listing.location) {
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    list.geometry = response.body.features[0].geometry;
  }

  await list.save();

  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listing/${id}`);
};

/* ==============================================================
   DELETE LISTING
   Route: DELETE /listing/:id
   Middleware: isLoggedIn, isOwner
============================================================== */
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;

  // Find listing
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listing");
  }

  // Delete image from Cloudinary
  await cloudinary.uploader.destroy(listing.image.filename);

  // Remove listing from DB
  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listing");
};

/* ==============================================================
   SEARCH LISTINGS
   Route: GET /listing/search
============================================================== */

module.exports.searchListing = async (req, res) => {
  const searchTerm = req.query.q;
  let allListings = [];

  // Check if input is a number => price search
  // isNaN() function is used to check is the given term is not a number
  if (!isNaN(searchTerm)) {
    const maxPrice = Number(searchTerm);
    allListings = await Listing.find({ price: { $lte: maxPrice } });
  } else {
    // Otherwise search by location or country (case-insensitive)
    allListings = await Listing.find({
      $or: [
        { location: { $regex: searchTerm, $options: "i" } },
        { country: { $regex: searchTerm, $options: "i" } },
      ],
    });
  }

  res.render("listing/index.ejs", { allListings, searchTerm , title: "bookMyBrix | Searched listing" });
};































// const { model } = require("mongoose");
// const { Listing } = require("../models/listing");

// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const mapToken = process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// module.exports.index = async (req, res) => {
//   let allListing = await Listing.find({});
//   res.render("listing/index.ejs", {
//     allListing,
//     title: "bookMyBrix | All listings",
//   });
// };

// module.exports.createListing = async (req, res) => {
//   let response = await geocodingClient
//     .forwardGeocode({
//       query: req.body.listing.location,
//       limit: 1,
//     })
//     .send();

//   let image = req.file.path;
//   let filename = req.file.filename;
//   const newListing = new Listing(req.body.listing);
//   newListing.owner = req.user._id;
//   newListing.image = { url: image, filename };
//   newListing.geometry = response.body.features[0].geometry;
//   await newListing.save();
//   req.flash("success", "New Listing Created!");
//   res.redirect("/listing");
// };

// module.exports.newListingForm = (req, res) => {
//   res.render("listing/new.ejs", { title: "bookMyBrix | New listing" });
// };

// module.exports.searchListing = async (req, res) => {
//   const searchTerm = req.query.q;
//   let allListing = [];

//   // Check if input is a number => price search
//   // isNaN() function is used to check is the given term is not a number
//   if (!isNaN(searchTerm)) {
//     const maxPrice = Number(searchTerm);
//     allListing = await Listing.find({ price: { $lte: maxPrice } });
//   } else {
//     // Otherwise search by location or country (case-insensitive)
//     allListing = await Listing.find({
//       $or: [
//         { location: { $regex: searchTerm, $options: "i" } },
//         { country: { $regex: searchTerm, $options: "i" } },
//       ],
//     });
//   }

//   res.render("listing/index.ejs", { allListing, searchTerm });
// };

// module.exports.individualListing = async (req, res) => {
//   let { id } = req.params;
//   let list = await Listing.findById(id)
//     .populate({ path: "reviews", populate: { path: "author" } })
//     .populate("owner");
//   if (!list) {
//     req.flash("error", "Requested page not found!");
//     res.redirect("/listing");
//   }
//   res.render("listing/show", {
//     list,
//     title: `bookMyBrix | ${list.title}`,
//     token: process.env.MAP_TOKEN,
//   });
// };

// module.exports.destroyListing = async (req, res) => {
//   let { id } = req.params;
//   await Listing.findByIdAndDelete(id);
//   req.flash("success", "Listing deleted!");
//   res.redirect("/listing");
// };

// module.exports.updateListing = async (req, res) => {
//   let response = await geocodingClient
//     .forwardGeocode({
//       query: req.body.listing.location,
//       limit: 1,
//     })
//     .send();
//   let { id } = req.params;
//   let listing = await Listing.findByIdAndUpdate(
//     id,
//     { ...req.body.listing },
//     { runValidators: true }
//   );
//   if (typeof req.file !== "undefined") {
//     let image = req.file.path;
//     let filename = req.file.filename;
//     listing.owner = req.user._id;
//     listing.image = { url: image, filename };
//     await listing.save();
//   }
//   listing.geometry = response.body.features[0].geometry;
//   await listing.save();
//   req.flash("success", "Listing updated!");
//   res.redirect(`/listing/${id}`);
// };

// module.exports.listingEditForm = async (req, res) => {
//   let { id } = req.params;
//   let list = await Listing.findById(id);
//   if (!list) {
//     req.flash("error", "Requested page not found!");
//     res.redirect("/listing");
//   }

//   let orgImageUrl = list.image.url;
//   orgImageUrl = orgImageUrl.replace("/upload", "/upload/h_250,w_300");

//   res.render("listing/edit", {
//     list,
//     orgImageUrl,
//     title: "bookMyBrix | Edit listing",
//   });
// };
