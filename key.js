const localStrategy = require('passport-local').Strartegy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// load User model

const User = require('models/Data');

module.exports = function(passport) {
    passport.use(
        new localStrategy( { usernameField:'Email'}, (email, password, done) => {
            User.findOne({emailAddress : email})
                .then(user => {
                    if (!user) {
                        return done(nulll, false, { message: 'That email is not registred'});
                    }
                    // Match
                    bcrypt.compare(password, user.password);
                })
                .catch(err => {
                    console.log(err);
                })
        })
    )
}