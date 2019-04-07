// Require all models
const db = require("../models");
// Helper function to check if user is logged in and get their info if they are
function loggedIn(req, res, next) {
    if (req.user) {
        next();
    }
    else {
        console.log("Login was not conserved");
        res.redirect('/');
    }
}

module.exports = function (app) {
    
};