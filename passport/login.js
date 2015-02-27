// PASSPORT STRATEGIES
var LocalStrategy       = require('passport-local').Strategy;
var GoogleStrategy      = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy    = require('passport-facebook').Strategy;

var User                = require('../models/user');
var bCrypt              = require('bcrypt-nodejs');

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

   


    // GOOGLE LOGIN ---------------
    // ============================

    passport.use('google', new GoogleStrategy({

        clientID        : '404609311846-b57s49m8kf12ud87u8s4ub4s0v9i09hm.apps.googleusercontent.com',
        clientSecret    : 'CfRILow9Jeqibml-98tBQf7G',
        callbackURL     : 'http://localhost:1234/auth/google/callback'

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their email
            User.findOne({ 'email' : profile.emails[0].value }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {
                    
                    // if user.google.id === undefined save google data to document
                    if(user.google.id === undefined) {
                        saveGoogleData(profile, user);
                    }

                    console.log('hitting another return');
                    // if a user is found, log them in
                    return done(null, user);
                } else {

                    // if the user.email isn't in our database, create a new user
                    var newUser          = new User();

                    // setting default email as primary index for document.
                    newUser.email = profile.emails[0].value; 

                    // save the rest of google data and save the new user
                    saveGoogleData(profile, newUser);
                }
            });
        });

        var saveGoogleData = function(profile, user) {
            // set all of the relevant information
            user.google.id    = profile.id;
            user.google.token = token;
            user.google.name  = profile.name.givenName + ' ' + profile.name.familyName;
            user.google.email = profile.emails[0].value; // pull the first email

            user.save(function(err) {
                if (err)
                    throw err;

                console.log('saving google data');
                return done(null, user);
            });
        }

    }));

    

    // FACEBOOK LOGIN -------------
    // ============================
    passport.use('facebook', new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : '437910229706460',
        clientSecret    : '67c6dd57caaff1bda2aae8e745a94dc7',
        callbackURL     : 'http://localhost:1234/auth/facebook/callback'

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // try to find the user based on their email
            User.findOne({ 'email' : profile.emails[0].value }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {

                    // if user.facebook.id === undefined save facebook data to document
                    if(user.facebook.id === undefined) {
                        saveFacebookData(profile, user);  
                    }

                    // user found, return that user
                    return done(null, user); 

                } else {

                    // if the user.email isn't in our database, create a new user
                    var newUser   = new User();

                    // setting default email as primary index for document.
                    newUser.email = profile.emails[0].value;

                    // save the rest of fb data and save the new user
                    saveFacebookData(profile, newUser);

                }

            });
        });
        

        var saveFacebookData = function(profile, user) {
            user.facebook.id    = profile.id; // set the users facebook id                   
            user.facebook.token = token; // we will save the token that facebook provides
            user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
            user.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

            user.save(function(err) {
                if (err)
                    throw err;

                // if successful, return the new user
                return done(null, user);
            });
        }
    }));

}