// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
const express = require("express");
const passport = require('passport');
// const csrf = require('csurf');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
require('dotenv').config();
const mongoose = require("mongoose");
const db = require("./models");
const path = require("path");

// Set up the Express App
// =============================================================
// Initialize Express
const app = express();
// Use case-sensitive routing
app.set("case sensitive routing", true);
// Use an environmental port when in production or 3001 in development
const PORT = process.env.PORT || 3001;
// If deployed, use the deployed database. Otherwise use the local WompsAndChomps database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/WompsAndChomps";

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up the Express app to use sessions with session storage handled by connect-mongo
app.use(session({
    secret: `${process.env.sessionSecret}`, // Secret for signing a session cookie
    name: "session", // Set name of session in cookie to something generic to reduce the likelihood of an attacker using it to fingerprint the server and target attacks accordingly
    resave: false, // Set to false to not save a session if unmodified - prevents resaving all the session data on the database every single time that the user refreshes the page
    saveUninitialized: true, // Set to false to not create a session until something is stored
    // secure: true, // Enable once TLS is set up - Ensures the browser only sends the cookie over HTTPS
    httpOnly: true, // Default of express-session is true. Ensures the cookie is sent only over HTTP(S), not client JavaScript, helping to protect against cross-site scripting attacks
    unset: "destroy", // Control the result of unsetting req.session through destroy(); The default value is 'keep', so this sets the session to be destroyed (deleted) when the response ends
    store: new MongoStore({ // Set instance of a session store to a new connect-mongo store
        mongooseConnection: mongoose.connection, // Use the existing Mongoose connection to the MongoDB
        url: MONGODB_URI, // Set the database URL based on environment
        ttl: 1 * 2 * 60 * 60 // Session expiration length = 14 days - Connect Mongo default
        // touchAfter: 24 * 3600 // Enable for Lazy session update - time period in seconds
    })
}));

// Apply CSRF protection across app - enable when tokens are in place
// app.use(csrf({ 
//     cookie: false, // When set to true (or an object of options for the cookie), then the module changes behavior and no longer uses req.session
//     ignoreMethods: ['HEAD', 'OPTIONS'] // Defaults to ['GET', 'HEAD', 'OPTIONS'], so remove GET to protect routes listening for GET requests
//     The alternative is to not use GET routes for anything sensitive, which is what we're going to go with
// }));

// Initialize Passport to be used by the Express app to to manage user authentication requests
app.use(passport.initialize());
// Initialize Passport Sessions to be used by the Express app to to manage user sessions
app.use(passport.session());

// Serve up static assets (in production)
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

// Routes
// =============================================================
// Load passport strategies
require("./config/passport.js")(passport, db.User); // Pass the User schema to Passport to serialize and deserialize user information from session IDs
// Set up the Express app to use Passport strategies for authentication routes
require("./routes/auth-routes.js")(app, passport);
// Set up the Express app to use the event API routes
require("./routes/event-routes.js")(app);
// Send every other request to the React app
// Define any API routes before this runs
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true });

// Start the API server
app.listen(PORT, function () {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});