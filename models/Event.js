// Import mongoose
const mongoose = require("mongoose");
// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new EventSchema object
const EventSchema = new Schema({
    // `dateAndTime` is of type String for the date ranges of the Event
    dateAndTime: {
        type: String,
        required: true
    },
    // `title` is of type String for the title of the Event
    title: {
        type: String,
        required: true,
        unique: true // Prevent duplicates
    },
    // `fullTitle` is of type String for the full title, including venue, of the Event
    fullTitle: {
        type: String,
        required: true
    },
    // `link` is of type String for the link to the Event page
    link: {
        type: String,
        required: true
    },
    // `imgSrc` is of type String for the source of the background image
    imgSrc: {
        type: String
    },
    // `tags` is of type String for the tags of the Event
    tags: {
        type: String,
        required: true
    },
    genres: {
        type: Array,
        required: true
    },
    // `priceAndAges` is of type String for the price and ages of the Event
    priceAndAges: {
        type: String
    },
    // `organizers` is of type String for the organizers of the Event
    organizers: {
        type: String
    },
    // `externalLinkTitle` is of type String for the title any external links associated with the Event
    externalLinkTitle: {
        type: String
    },
    // `externalLink` is of type String for the link for any external links associated with the Event
    externalLink: {
        type: String
    },
    // `reformattedDate` is of type Date for only reformatting events that don't have an image yet
    reformattedDate: {
        type: Date
    },
    // `sortDate` is of type Date for sorting Events
    sortDate: {
        type: Date
    },
    // `notes` is an array of objects to hold the ObjectIds of saved notes associated with a User's saved Event
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

// This creates the Event model from the above schema, using mongoose's model method
const Event = mongoose.model("Event", EventSchema);

// Export the Event model
module.exports = Event;