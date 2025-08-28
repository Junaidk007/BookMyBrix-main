// Load environment variables from .env file (only in development, not in production)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const dbUrl = process.env.ATLASDB_URL;

// ------------------ Import Required Modules ------------------
const express = require("express");
const app = express();
const path = require("path"); // For handling file & directory paths
const mongoose = require("mongoose"); // MongoDB ODM
const methodOverride = require("method-override"); // To support PUT/DELETE in forms
const ejsMate = require("ejs-mate"); // Layout engine for EJS templates
const ExpressError = require("./utils/ExpressError"); // Custom error handler
const session = require("express-session"); // Session management
const MongoStore = require("connect-mongo");
const flash = require("connect-flash"); // For showing temporary messages
const passport = require("passport"); // Authentication middleware
const LocalStrategy = require("passport-local"); // Username-password strategy for passport
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const multer = require("multer"); // For handling file uploads

// ------------------ Import Project Files ------------------
const listingRouter = require("./router/listing"); // Handles all listing routes
const reviewRouter = require("./router/review"); // Handles review routes
const userRouter = require("./router/user"); // Handles user login/signup routes
const User = require("./models/user"); // User model (passport-local-mongoose)
const { setNavbar } = require("./middleware"); // Middleware to dynamically set navbar

// ------------------ App Configuration ------------------
const port = 8080;

// Multer setup for storing uploaded files in /uploads folder
const upload = multer({ dest: "uploads/" });

// Creating session store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.MY_SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("error in mongo session store", err);
});

// Session configuration
const sessionOptions = {
  store,
  secret: process.env.MY_SECRET, // Should ideally come from .env file
  resave: false,
  saveUninitialized: true,
  cookie: {
    // Configure session cookie
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Expires in 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // Prevents client-side JS from accessing cookies
  },
};

const googleEnvInfo = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};

async function userAuth(accessToken, refreshToken, profile, done) {
  try {
    // 1) Grab the safe fields Google sends
    const googleId = profile.id;
    const email =
      profile.emails && profile.emails[0] && profile.emails[0].value;
    const photo =
      profile.photos && profile.photos[0] && profile.photos[0].value;
    const displayName = profile.displayName;

    // 2) First look for a user that already used Google here
    let user = await User.findOne({ googleId });

    // 3) Or maybe they signed up locally earlier with the same email — link accounts
    if (!user && email) {
      user = await User.findOne({ email });
      if (user && !user.googleId) {
        user.googleId = googleId;
        if (photo && !user.profilePic) user.profilePic = photo;
        await user.save();
        return done(null, user);
      }
    }

    // 4) If still no user, create one
    if (!user) {
      const baseUsername =
      (email && email.split("@")[0]) ||
      (displayName && displayName.replace(/\s+/g, "")) ||
    "user";

  // no uniqueness check
  const username = baseUsername;

  user = new User({
    username,
    email, // may be undefined if user hides email
    googleId,
    profilePic: photo,
  });
  await user.save();
}

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}

// Set EJS engine with ejs-mate for layouts
app.engine("ejs", ejsMate);

// Middlewares
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(methodOverride("_method")); // Allows ?_method=PUT/DELETE in forms
app.use(express.static(path.join(__dirname, "public"))); // Serve static files (CSS, JS, Images)
app.use(session(sessionOptions));
app.use(flash());

// ------------------ Passport.js Setup ------------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // Local strategy from passport-local-mongoose
passport.use(new GoogleStrategy(googleEnvInfo,userAuth)); // google strategy from passport-google-oauth20
passport.serializeUser(User.serializeUser()); // Store user in session
passport.deserializeUser(User.deserializeUser()); // Retrieve user from session

// Flash messages & current user middleware (available in all views)
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // Gives access to current user in all EJS templates
  next();
});

// Set view engine as EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ------------------ Database Connection ------------------

main().catch((err) => console.error(err));
async function main() {
  await mongoose.connect(dbUrl);
  console.info("✅ Database connection successful.");
}

// ------------------ Custom Middleware ------------------
app.use(setNavbar); // Sets navbar links based on authentication

// ------------------ Routes ------------------
app.use("/listing", listingRouter); // All /listing routes
app.use("/listing/:id/review", reviewRouter); // Nested reviews under a listing
app.use("/", userRouter); // User routes (login, signup, logout)

// ------------------ Error Handling ------------------
// Handles all undefined routes (404)
app.all("*", (req, res, next) => {
  let error = new ExpressError(
    404,
    "The page you are looking for may have been moved, deleted, or possibly never existed."
  );
  next(error);
});

// Centralized error handler middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs", { message, status });
});

// ------------------ Server Start ------------------
app.listen(port, () => console.log(`🚀 Server running on port: ${port}`));

