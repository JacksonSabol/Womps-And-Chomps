// Require all models
const db = require("../models");
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
    // GET route for finding the logged in user's information
    app.get('/user/info', loggedIn, function (req, res) {
        // Check if the username associated with the session matches the username for which information is being requested
        if (req.user.username === req.query.username) {
            // If they do, grab the document in the User collection where the _id is equal to the id of the logged in user
            db.User.findOne({ _id: req.user.id })
                .then(dbUser => {
                    // Return status OK and any data we need
                    res.status(200).send({
                        auth: true,
                        username: dbUser.username
                    });
                })
                // Handle any stray errors
                // .catch(err => res.status(403).json(err));
                .catch(err => console.log(err));
        } else {
            // If the usernames don't match, return status Forbidden
            res.status(403).send('Session and username do not match');
        }
    });
};