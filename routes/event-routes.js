// Import cheerio to parse the HTML and find elements
const cheerio = require("cheerio");
// Import axios to make HTTP requests
const axios = require("axios");
// Import request-promise to make HTTP requests in parallel
const request = require("request-promise");
// Import helper functions for link splitting and retrieving images
const getFacebookImage = require("./link-splitting").getFacebookImage;
const getEventbriteImage = require("./link-splitting").getEventbriteImage;
const splitUrl = require("./link-splitting").splitUrl;
// Require all models
const db = require("../models");
// Require Moment to return events based on what day is is
const moment = require('moment')
// Helper function to check if user is logged in
function loggedIn(req, res, next) {
    // This checks to see if Passport successfully loaded the user from the session id and wrote it to the request
    if (req.user) {
        // console.log(req.user);
        // If so, move on to the next step
        next();
    }
    // Otherwise return status Entity Not Found
    else {
        console.log("Login was not conserved");
        res.status(404).send('User not found');
    }
}
function adminLoggedIn(req, res, next) {
    if (req.user && req.user.username === "JacksonSabol") {
        next();
    }
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
            .then(dbEvents => {
                db.User.findOne({ _id: req.user.id })
                    .then(dbUserEvents => {
                        const data = {
                            events: dbEvents,
                            saved: dbUserEvents.events
                        };
                        res.status(200).json(data);
                    })
            })
            .catch(err => res.status(422).json(err));
    });
    // GET route for getting all of the logged-in user's saved events
    app.get("/api/events/saved", loggedIn, function (req, res) {
        // Grab the document in the User collection where the _id is equal to the id of the logged in user
        db.User.findOne({ _id: req.user.id })
            // Populate all of the events associated with the User
            .populate("events")
            // .then(dbUserEvents => console.log(dbUserEvents.events))
            .then(dbUserEvents => res.json(dbUserEvents.events))
            // .catch(err => res.status(422).json(err));
            .catch(err => console.log(err));
    });
    // PUT route for "saving" an event
    app.put("/api/events/save/:id", loggedIn, function (req, res) {
        // Find the event in the database and return it if it exists
        db.Event.findOne({ _id: req.params.id })
            .then(dbEvent => {
                // Find the user in the database and return them if they exist
                db.User.findOne({ _id: req.user.id })
                    .then(dbUser => {
                        // Check if the user has saved the event before
                        const userEvents = dbUser.events;
                        const eventId = String(req.params.id);
                        if (userEvents.indexOf(eventId) > -1) {
                            res.status(409).send("Duplicate Entry");
                            return;
                        } else {
                            // Add the event _id to the array of events in the User collection
                            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                            return db.User.findOneAndUpdate({ _id: req.user.id }, { $push: { events: dbEvent._id } }, { new: true });
                        }
                    })
                    .then(function (dbUserNew) {
                        res.status(200).send(dbEvent._id);
                    })
            })
            // .catch(err => res.status(422).json(err));
            .catch(err => console.log(err));
    });
    // PUT route for "unsaving" an event
    app.put("/api/events/unsave/:id", loggedIn, function (req, res) {
        // Grab the document in the User collection where the _id is equal to the id of the logged in user
        db.User.findOne({ _id: req.user.id })
            // Populate all of the events associated with the User
            .populate("events")
            .then(dbUserEvents => {
                // Once the user and their events are returned from the query, filter the events refs to no longer include the "unsaved" one
                const updatedEvents = dbUserEvents.events.filter(event => String(event._id) !== String(req.params.id));
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                return db.User.findOneAndUpdate({ _id: req.user.id }, { $set: { events: updatedEvents } }, { new: true }).populate("events");
            })
            // Since the mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            .then(function (updatedUserEvents) {
                // If we were able to successfully update a User's events, send them back to the client
                res.json(updatedUserEvents.events);
            })
            // .catch(err => res.status(422).json(err));
            .catch(err => console.log(err));
    });
    // new GET route for scraping data from 19hz and adding FB photos
    // app.get("/api/events/scrape", adminLoggedIn, function (req, res, next) {
    // Parse out venue from fullTitle and add to new field - split on '@'
    app.get("/api/events/scrape", adminLoggedIn, function (req, res, next) {
        (async function () {
            try {
                const url = "https://19hz.info/eventlisting_BayArea.php";
                const baseHtml = await request(url);
                const $ = cheerio.load(baseHtml);
                const table = $('table').slice(0, 1);
                const eventData = $(table).find('tr').map((i, row) => {
                    const formattedData = {};
                    formattedData.dateAndTime = $(row).children('td').eq(0).text();
                    formattedData.title = $(row).children('td').eq(1).children("a").text();
                    formattedData.fullTitle = $(row).children('td').eq(1).text();
                    formattedData.link = $(row).children('td').eq(1).children("a").attr("href");
                    formattedData.tags = $(row).children('td').eq(2).text();
                    formattedData.priceAndAges = $(row).children('td').eq(3).text();
                    formattedData.organizers = $(row).children('td').eq(4).text();
                    formattedData.externalLinkTitle = $(row).children('td').eq(5).text();
                    formattedData.externalLink = $(row).children('td').eq(5).children("a").attr("href");
                    formattedData.sortDate = $(row).children('td').eq(6).children("div").text();
                    return formattedData;
                }).get();
                await Promise.all(eventData.map(async (event) => {
                    try {
                        const url = event.link ? event.link : "w.N/A.w";
                        const urlMod = await splitUrl(url);
                        if (urlMod === "facebook") {
                            await getFacebookImage(url, function (source) {
                                event.imgSrc = source;
                            });
                        } else if (urlMod === "eventbrite") {
                            const source = await getEventbriteImage(url);
                            event.imgSrc = source;
                        } else {
                            event.imgSrc = "N/A"
                        }
                        return event;
                    } catch (e) {
                        console.log(e);
                    }
                }));
                // console.log(eventData);
                db.Event.insertMany(eventData, { ordered: false })
                    .then(function (dbResponse) {
                        // View the added results in the console
                        // console.log(dbResponse);
                        res.status(200).send(`Scrape complete. ${dbResponse.length} events inserted.`);
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                        console.log("write errors", err.writeErrors.length);
                        res.status(400).send(`Scrape complete. ${err.writeErrors.length} duplicate entries.`);
                        // Move to the next entry if an error occurs (duplicates)
                        // next();
                    });
                // , function(error, docs) {});
            } catch (e) {
                console.log(e.message);
            }
        })();
    });

    // old GET route for scraping data from 19hz
    // app.get("/api/events/scrape", function (req, res, next) {
    //     // Make an HTTP request via axios for 19hz's "San Francisco Bay Area / Northern California" list
    //     axios.get("https://19hz.info/eventlisting_BayArea.php").then(function (res) {
    //         // Load the HTML into cheerio and save it to a variable
    //         // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    //         const $ = cheerio.load(res.data);
    //         // Isolate the desired values (i: iterator. element: the current element)
    //         $("table").each(function (i, element) {
    //             if (i === 0) {
    //                 $(element).find("tr").each(function (i, element) {
    //                     // Define an empty object to save the data that we'll scrape
    //                     var result = {};
    //                     result.dateAndTime = $(element).children('td').eq(0).text();
    //                     result.title = $(element).children('td').eq(1).children("a").text();
    //                     result.fullTitle = $(element).children('td').eq(1).text();
    //                     result.link = $(element).children('td').eq(1).children("a").attr("href");
    //                     result.tags = $(element).children('td').eq(2).text();
    //                     result.priceAndAges = $(element).children('td').eq(3).text();
    //                     result.organizers = $(element).children('td').eq(4).text();
    //                     result.externalLinkTitle = $(element).children('td').eq(5).text();
    //                     result.externalLink = $(element).children('td').eq(5).children("a").attr("href");
    //                     result.sortDate = $(element).children('td').eq(6).children("div").text();

    //                     // Insert a new Event into the Event collection using the `result` object built from scraping
    //                     db.Event.create(result)
    //                         .then(function (dbEvent) {
    //                             // View the added result in the console
    //                             console.log(dbEvent);
    //                         })
    //                         .catch(function (err) {
    //                             // If an error occurred, log it
    //                             console.log(err);
    //                             // Move to the next entry if an error occurs (duplicates)
    //                             next();
    //                         });
    //                 });
    //             }
    //         });

    //     });
    //     res.status(200).send('Scrape complete');
    // });
};