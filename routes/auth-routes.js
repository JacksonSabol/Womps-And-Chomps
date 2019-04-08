module.exports = function (app, passport) {
    // Sign up a new user
    app.post('/user/signup', passport.authenticate('local-signup'), function (req, res) {
        res.status(200).send({
            auth: true,
            message: 'User created'
        });
    });

    // Sign in existing user
    app.post("/user/signin", passport.authenticate('local-signin'), function (req, res) {
        console.log(req.session);
        res.status(200).send({
            auth: true,
            message: 'User logged in'
        });
    });
    // Logout user by destroying the session
    // https://stackoverflow.com/a/14587231/10503606 for reference on using POST over GET
    app.post("/user/logout", function (req, res) {
        req.session.destroy(function (err) {
            if (err) console.log(err);
            // res.redirect('/');
            res.sendStatus(204);
        });
    });
}