var LocalStrategy   = require('passport-local').Strategy;
//var GoogleStrategy  = require('passport-google').Strategy;
var GoogleStrategy  = require('passport-google-oauth').OAuth2Strategy;
var GooglePlusStrategy = require('passport-google-plus');
var User            = require('../models/user');
var bCrypt          = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
            // check in mongo if a user with username exists or not
            User.findOne({ 'username' :  username }, 
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false, req.flash('message', 'User Not found.'));                 
                    }
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                    }
                    // User and password both match, return user from done method
                    // which will be treated like success
                    return done(null, user);
                }
            );

        })
    );

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }

   



    passport.use('google', new GoogleStrategy({

        clientID        : '404609311846-b57s49m8kf12ud87u8s4ub4s0v9i09hm.apps.googleusercontent.com',
        clientSecret    : 'CfRILow9Jeqibml-98tBQf7G',
        callbackURL     : 'http://localhost:1234/auth/google/callback'

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
            //console.log(profile);
            // try to find the user based on their email
            User.findOne({ 'email' : profile.emails[0].value }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
                    //newUser.google.id    = profile.id;
                    //newUser.google.token = token;
                    newUser.firstName    = profile.name.givenName;
                    newUser.email        = profile.emails[0].value; // pull the first email

                    console.log(newUser);
                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }));


  
}