// Import bCrypt for encrypting and decrypting passwords
const bCrypt = require('bcrypt-nodejs');
// Define a function to encrypt the user's password
const generateHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(12), null);
}
// Define a function to compare two passwords - user entered password and password stored in the User table
const isValidPassword = function (userpass, password) {
    // Use bCrypt method to compare the two passwords - returns 'true' or 'false'
    return bCrypt.compareSync(password, userpass);
}
// Import Local Strategy constructor from "passport-local" module
const LocalStrategy = require('passport-local').Strategy;

// Export local strategies, accepting "Passport" module and the "User" schema from server.js
module.exports = function (passport, user) {
    // Assign a variable to hold the "User" schema
    const User = user;
    // Tell passport to use a new LocalStrategy called "local-signup"
    passport.use('local-signup', new LocalStrategy(
        {
            // By default, Passport LocalStrategy uses a username and a password
            usernameField: 'username', // Setting the authenticating username to be the inputted username
            passwordField: 'password', // Setting the authenticating password to be the inputted password
            passReqToCallback: true // Pass the entire request to the callback function so we can encrypt the password and add an entry into the User collection
        },
        // Define callback function to handle sign-up
        function (req, username, password, done) {
            // Check the User collection for an entry matching the user-inputted username
            User.findOne({ username: String(username) }) // Cast usernames and passwords to strings to prevent NoSQL injection
                .then(function (dbUser) {
                    // If an entry is found, the username is already taken, i.e. a user already has an account with that name
                    if (dbUser) {
                        return done(null, false,
                            {
                                message: 'That username is already taken.'
                            });
                    }
                    // Otherwise, the username is not taken, so make a new one
                    else {
                        // Encrypt the user's password using the bCrypt helper function
                        const userPassword = generateHash(String(password)); // Cast usernames and passwords to strings to prevent NoSQL injection
                        // Assign a variable to hold the user's authentication information
                        const newUserData = {
                            username: String(username),
                            password: userPassword
                        };
                        // Create a document in the User collection with the user's information
                        User.create(newUserData).then(function (newUser) {
                            // If the document was not successfully added to the User collection
                            if (!newUser) {
                                // Return error: null and user: false
                                return done(null, false,
                                    {
                                        message: 'Our servers are under a heavy load right now. Please try again in a moment.'
                                    });
                            }
                            // Otherwise, return error: null and the newUser
                            if (newUser) {
                                return done(null, newUser.id);
                            }
                        });
                    }
                });
        }
    ));
    // Tell passport to use a new LocalStrategy called "local-signin"
    passport.use('local-signin', new LocalStrategy(
        {
            // By default, Passport LocalStrategy uses a username and a password
            usernameField: 'username', // Setting the authenticating username to be the inputted username
            passwordField: 'password', // Setting the authenticating password to be the inputted password
            passReqToCallback: true // Pass the entire request to the callback function to compare username/password to those stored in the User collection
        },
        function (req, username, password, done) {
            // Check the User collection for an entry matching the user-inputted username
            User.findOne({ username: String(username) }) // Cast usernames and passwords to strings to prevent NoSQL injection
                .then(function (dbUser) {
                    // If no entry matches the user-inputted username
                    if (!dbUser) {
                        // Return error: null, user: false
                        return done(null, false, {
                            message: 'Username does not exist in our database'
                        });
                    }
                    // If the user-inputted password does not match the password from the User table
                    if (!isValidPassword(dbUser.password, String(password))) { // Cast usernames and passwords to strings to prevent NoSQL injection
                        // Return error: null, user: false
                        return done(null, false, {
                            message: 'Incorrect password.'
                        });
                    }
                    // Otherwise, the user is authenticated
                    // Write the userId to the session store by passing it to the serializeUser helper function
                    return done(null, dbUser.id);
                })
                .catch(function (err) {
                    console.log("Error:", err);
                    return done(null, false, {
                        message: 'Our servers are under a heavy load right now. Please try again in a moment.'
                    });
                });
        }
    ));
    // This stores the User objectID in the session once authenticated
    // "The meaning and application logic associated to the session ID must be stored on the server side"

    // Save the user id (the second argument of the done function) in a session
    // It is later used to retrieve the whole object via the deserializeUser function
    passport.serializeUser(function (id, done) {
        done(null, id);
    });

    // Retrieve the user id from the stored session
    passport.deserializeUser(function (id, done) {
        // Check the User collection for a matching user id and pass the user information into the parameter of the callback function
        User.findById(id).then(function (user) {
            // If the user is found in the User collection
            if (user) {
                // Return error: null, and the user's authentication information
                done(null, user);
            }
            // Otherwise, the user's id was not found, or the session was destroyed
            else {
                // Return the specific error, user: null
                done(user.errors, null);
            }
        });
    });
}