// BASE SETUP
// ======================================

var express         = require('express'); // call express
var app             = express();  // define our app using express
var path            = require('path');

var morgan          = require('morgan'); // used to see requests
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var flash           = require('connect-flash'); // store and display messages in templates

var config          = require('./config'); // our config file
var port            = config.port; // set the port for our app
var mongoose        = require('mongoose'); // for working w/ our database

var passport        = require('passport'); // unobtrusive authentication middleware (local, oauth etc)
var expressSession  = require('express-session');
var superSecret     = config.secret; // secret used to create tokens
var initPassport    = require('./passport/init'); 


// Initialize Passport
initPassport(passport);

// Connect to DATABASE -----------------
mongoose.connect(config.database);




// APP CONFIGURATION
// ======================================

// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// log all requests to the console
app.use(morgan('dev'));


// om nom nom
app.use(cookieParser()); 


// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));


// Configuring Passport in App
app.use(expressSession({secret: superSecret}));
app.use(passport.initialize());
app.use(passport.session());


app.use(flash()); // Using the flash middleware provided by connect-flash to store messages in session




var routes = require('./routes/index')(passport);
app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//module.exports = app;
app.listen(port);
console.log('Express listening on port ' + port);
// #!/usr/bin/env node
// var debug = require('debug')('passport-mongo');
// var app = require('../app');
// var config = require('../config');

// app.set('port', process.env.PORT || config.port);

// var server = app.listen(app.get('port'), function() {
//   debug('Express server listening on port ' + server.address().port);
// });