// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
const express = require("express");
const passport = require('passport');
const session = require('express-session');
// const env = require('dotenv').load();
require('dotenv').config();
const mongoose = require("mongoose");
const db = require("./models");
const path = require("path");

// Set up the Express App
// =============================================================
// Initialize Express
const app = express();
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
app.use(session({ secret: `${process.env.sessionSecret}`, resave: true, saveUninitialized: true }));

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
require("./config/passport.js")(passport, db.User);
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