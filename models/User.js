// Import mongoose
const mongoose = require("mongoose");
// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
const UserSchema = new Schema({
    // `username` is of type String for the username of the User
    username: {
        type: String,
        required: true
    },
    // `password` is of type String for the password of the User
    password: {
        type: String,
        required: true
    },
    // `lastlogin` is of type Date for the last login time of a User
    lastlogin: {
        type: Date
    },
    // `events` is an array of objects to hold the ObjectIds of saved events associated with a User
    events: [{
        type: Schema.Types.ObjectId,
        ref: "Event"
    }]
});

// This creates the User model from the above schema, using mongoose's model method
const User = mongoose.model("User", UserSchema);

// Export the User model
module.exports = User;