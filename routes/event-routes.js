// Import cheerio to parse the HTML and find elements
const cheerio = require("cheerio");
// Import axios to make the HTTP request for the HTML page
const axios = require("axios");
// Require all models
const db = require("../models");
// Require Moment to return events based on what day is is
const moment = require('moment')
// Helper function to check if user is logged in
function loggedIn(req, res, next) {
    // This checks to see if Passport successfully loaded the user from the session id and wrote it to the request
    if (req.user) {
        // If so, move on to the next step
        next();
    }
    // Otherwise return status Entity Not Found
    else {
        console.log("Login was not conserved");
        res.status(404).send('User not found');
    }
}

module.exports = function (app) {
    // Set the start of the day for querying
    const today = moment().startOf('day')
    // GET route for retrieving all documents in the Events collection
    app.get("/api/events/all", loggedIn, function (req, res) {
        db.Event.find({
            sortDate: {
                $gte: today.toDate()
            }
        })
            // Sort by date
            .sort('field sortDate')
            .then(dbEvents => res.json(dbEvents))
            .catch(err => res.status(422).json(err));
    });
    // GET route for getting all of the logged-in user's saved events
    app.get("/api/events/saved", loggedIn, function (req, res) {
        // Grab the document in the User collection where the _id is equal to the id of the logged in user
        db.User.findOne({ _id: req.user.id })
            // Populate all of the events associated with the User
            .populate("events")
            .then(dbUserEvents => res.json(dbUserEvents))
            // .catch(err => res.status(422).json(err));
            .catch(err => console.log(err));
    });
    // PUT route for "unsaving" an event
    app.put("/api/events/edit/:id", loggedIn, function (req, res) {
        // Grab the document in the User collection where the _id is equal to the id of the logged in user
        db.User.findOne({ _id: req.user.id })
            // Populate all of the events associated with the User
            .populate("events")
            .then(dbUserEvents => {
                console.log("dbUserEvents from unsaving an event: ", dbUserEvents);
                // Once the user and their events are returned from the query, filter the events refs to no longer include the "unsaved" one
                // const newUserEvents = dbUserEvents["events"].filter(event => event._id !== req.params.id);
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // return db.User.findOneAndUpdate({ _id: req.user.id }, { $set: { events: newUserEvents } }, { new: true });
            })
            // Since the mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            // .then(function (updatedUserEvents) {
            // If we were able to successfully update a User's events, send them back to the client
            // res.json(updatedUserEvents);
            // })
            // .catch(err => res.status(422).json(err));
            .catch(err => console.log(err));
    });
    // GET route for scraping data from 19hz
    app.get("/api/events/scrape", function (req, res, next) {
        // Make an HTTP request via axios for 19hz's "San Francisco Bay Area / Northern California" list
        axios.get("https://19hz.info/eventlisting_BayArea.php").then(function (res) {
            // Load the HTML into cheerio and save it to a variable
            // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
            const $ = cheerio.load(res.data);
            // Isolate the desired values (i: iterator. element: the current element)
            $("table").each(function (i, element) {
                if (i === 0) {
                    $(element).find("tr").each(function (i, element) {
                        // Define an empty object to save the data that we'll scrape
                        var result = {};
                        result.dateAndTime = $(element).children('td').eq(0).text();
                        result.title = $(element).children('td').eq(1).children("a").text();
                        result.fullTitle = $(element).children('td').eq(1).text();
                        result.link = $(element).children('td').eq(1).children("a").attr("href");
                        result.tags = $(element).children('td').eq(2).text();
                        result.priceAndAges = $(element).children('td').eq(3).text();
                        result.organizers = $(element).children('td').eq(4).text();
                        result.externalLinkTitle = $(element).children('td').eq(5).text();
                        result.externalLink = $(element).children('td').eq(5).children("a").attr("href");
                        result.sortDate = $(element).children('td').eq(6).children("div").text();

                        // Insert a new Event into the Event collection using the `result` object built from scraping
                        db.Event.create(result)
                            .then(function (dbEvent) {
                                // View the added result in the console
                                console.log(dbEvent);
                            })
                            .catch(function (err) {
                                // If an error occurred, log it
                                console.log(err);
                                // Move to the next entry if an error occurs (duplicates)
                                next();
                            });
                    });
                }
            });

        });
        res.status(200).send('Scrape complete');
    });
};