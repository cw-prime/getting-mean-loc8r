var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var userModel = mongoose.model('User');

passport.use(new localStrategy({
        usernameField: 'email'
    }, function(username, password, done) {
        userModel.findOne({
            email: username
        }, function(err, user) {
            console.log('err: ' + JSON.stringify(err));
            if (err) {
                return done(err);
            }
            console.log('user: ' + JSON.stringify(user));

            if (!user) {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }

            if (!user.validatePassword(password)) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }

            return done(null, user);
        })
    }));