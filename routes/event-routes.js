// Import cheerio to parse the HTML and find elements
const cheerio = require("cheerio");
// Import axios to make HTTP requests
const axios = require("axios");
// Import request-promise to make HTTP requests in parallel
const request = require("request-promise");
// Import helper functions for link splitting and retrieving images
const getFacebookImage = require("./link-splitting").getFacebookImage;
const getDnaLoungeImage = require("./link-splitting").getDnaLoungeImage;
const getEventbriteImage = require("./link-splitting").getEventbriteImage;
const getTicketmasterImage = require("./link-splitting").getTicketmasterImage;
const getResAdvisorImage = require("./link-splitting").getResAdvisorImage;
const getTicketWebImage = require("./link-splitting").getTicketWebImage;
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
                    .populate("events")
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
                    const tags = $(row).children('td').eq(2).text();
                    formattedData.tags = tags;
                    const tagsArray = tags.split(',').map(tag => tag.trim());
                    formattedData.genres = tagsArray;
                    formattedData.priceAndAges = $(row).children('td').eq(3).text();
                    formattedData.organizers = $(row).children('td').eq(4).text();
                    formattedData.externalLinkTitle = $(row).children('td').eq(5).text();
                    formattedData.externalLink = $(row).children('td').eq(5).children("a").attr("href");
                    formattedData.reformattedDate = 1;
                    formattedData.sortDate = $(row).children('td').eq(6).children("div").text();
                    return formattedData;
                }).get();
                // console.log(eventData);
                db.Event.insertMany(eventData, { ordered: false })
                    .then(function (dbResponse) {
                        // View the added results in the console
                        console.log("Response from Database: ", dbResponse);
                        res.status(200).send(`Scrape complete. ${dbResponse.length} events inserted.`);
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                        console.log("write errors: ", err.writeErrors.length);
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
    // Route to reformat existing documents in database
    app.get("/api/events/reformat", adminLoggedIn, function (req, res, next) {
        db.Event.find({ reformattedDate: 1 })
            .then(dbEvents => {
                (async function () {
                    try {
                        const time = dbEvents.length * 100;
                        console.log(time);
                        const eventData = await Promise.all(dbEvents.map(async (event) => {
                            try {
                                const url = event.link ? event.link : "https://www.N/A.com";
                                const urlMod = await splitUrl(url);
                                if (urlMod === "facebook") {
                                    await getFacebookImage(url, function (source) {
                                        event.imgSrc = source;
                                        event.reformattedDate = today.toDate();
                                    });
                                } else if (urlMod === "dnalounge") {
                                    await getDnaLoungeImage(url, function (source) {
                                        event.imgSrc = source;
                                        event.reformattedDate = today.toDate();
                                    });
                                } else if (urlMod === "eventbrite") {
                                    const source = await getEventbriteImage(url);
                                    event.imgSrc = source;
                                    event.reformattedDate = today.toDate();
                                } else if (urlMod === "ticketmaster") {
                                    const source = await getTicketmasterImage(url);
                                    event.imgSrc = source;
                                    event.reformattedDate = today.toDate();
                                } else if (urlMod === "ticketweb") {
                                    const source = await getTicketWebImage(url);
                                    event.imgSrc = source;
                                    event.reformattedDate = today.toDate();
                                } else {
                                    event.imgSrc = "N/A"
                                    event.reformattedDate = 1;
                                }
                                return event;
                            } catch (e) {
                                console.log(e);
                            }
                        }));
                        const eventDataFiltered = eventData.filter(event => event.imgSrc !== "Removed");
                        for await (const event of eventDataFiltered) {
                            db.Event.findByIdAndUpdate(event._id, { $set: { imgSrc: event.imgSrc, reformattedDate: event.reformattedDate } }, { new: true })
                                .then(function (dbResponse) {
                                    res.write("a");
                                    // View the added results in the console
                                    console.log("Database Response: ", dbResponse);
                                })
                                .catch(function (err) {
                                    res.write("e");
                                    // If an error occurred, log it
                                    console.log("Error: ", err);
                                });
                        };
                        setTimeout(() => {
                            res.status(200);
                            res.end();
                        }, time);
                    } catch (e) {
                        console.log(e.message);
                    }
                })();
            })
            .catch(err => res.status(422).json(err));
    });
    // Route to reformat existing documents in database for Resident Advisor
    app.get("/api/events/reformat/ra", adminLoggedIn, function (req, res, next) {
        db.Event.find({ reformattedDate: 1 })
            .then(dbEvents => {
                (async () => {
                    try {
                        const filteredData = await dbEvents.filter(event => splitUrl(event.link) === "residentadvisor");
                        // console.log("before", filteredData);
                        let n = filteredData.length;
                        console.log(`${n} events to be updated, taking ${n * 2} seconds to complete.`);
                        async function* linkGen() {
                            let i = 0;
                            while (i < n) {
                                yield new Promise((resolve, reject) => {
                                    setTimeout(async () => {
                                        const tempSource = await getResAdvisorImage(filteredData[i].link);
                                        const source = tempSource.error ? tempSource.error : tempSource;
                                        i++
                                        resolve(source)
                                    }, 2000);
                                });
                            }
                        };
                        let i = 0;
                        for await (const result of linkGen()) {
                            console.log(i);
                            db.Event.findByIdAndUpdate(filteredData[i]._id, { $set: { imgSrc: result, reformattedDate: today.toDate() } }, { new: true })
                                .then(function (dbResponse) {
                                    res.write("a");
                                    // View the added results in the console
                                    console.log("Database Response: ", dbResponse);
                                })
                                .catch(function (err) {
                                    res.write("e");
                                    // If an error occurred, log it
                                    console.log("Error: ", err);
                                });
                            i++
                        }
                        setTimeout(() => {
                            res.status(200);
                            res.end();
                        }, 300);
                    } catch (e) {
                        console.log(e.message);
                    }
                })();
            })
            .catch(err => res.status(422).json(err));
    });
    // Route to reformat tags into an array
    app.get("/api/events/reformat/tags", adminLoggedIn, function (req, res, next) {
        db.Event.find({})
            .then(async dbEvents => {
                const reformattedData = await dbEvents.map(event => {
                    const tagsArray = event.tags.split(',').map(tag => tag.trim());
                    event.genres = tagsArray;
                    if (!event.reformattedDate) {
                        event.reformattedDate = 1;
                    }
                    return event;
                });
                // console.log(reformattedData);
                for await (const event of reformattedData) {
                    db.Event.findByIdAndUpdate(event._id, { $set: { genres: event.genres, reformattedDate: event.reformattedDate } }, { new: true })
                        .then(function (dbResponse) {
                            res.write("a");
                            // View the added results in the console
                            console.log("Database Response: ", dbResponse);
                        })
                        .catch(function (err) {
                            res.write("e");
                            // If an error occurred, log it
                            console.log("Error: ", err);
                        });
                }
                setTimeout(() => {
                    res.status(200).end();
                }, 5000);
            });
    });
    // Route to test finding documents that have not been reformatted
    app.get("/api/events/test/res", adminLoggedIn, function (req, res, next) {

        db.Event.find({ reformattedDate: 1 })
            .then(dbEvents => {
                console.log(dbEvents);
                for (const event of dbEvents) {
                    res.write(`${event.reformattedDate}, `);
                }
                setTimeout(() => {
                    res.status(200).end();
                }, 200);
            });
    });
};