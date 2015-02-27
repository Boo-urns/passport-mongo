// BASE SETUP ---------------------------
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




// APP CONFIGURATION --------------------
// ======================================

// configure our app to handle CORS requests
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});


// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// log all requests to the console
app.use(morgan('dev'));


// needed for passport to read auth cookies
app.use(cookieParser());  // om nom nom


// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));


// Configuring Passport in App
app.use(expressSession({secret: superSecret}));
app.use(passport.initialize());
app.use(passport.session());


// Using the flash middleware provided by 
// connect-flash to store messages in session
app.use(flash()); 




// ROUTES -------------------------------
// ======================================

var routes = require('./routes/index')(passport);
app.use('/', routes);


/// CATCH 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// Development error handler
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




// START THE SERVER ---------------------
// ======================================

app.listen(port);
console.log('Express listening on port ' + port);