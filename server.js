// modules =================================================
var express        	= require('express');
var app            	= express();
var port 			= process.env.PORT || 3000; // set our port
var mongoose       	= require('mongoose');
var passport		= require('passport');
var flash			= require('connect-flash');

var morgan			= require('morgan');
var cookieParser 	= require('cookie-parser');
var bodyParser     	= require('body-parser');
var methodOverride 	= require('method-override');
var session 		= require('express-session');

//var ble				= require('ble-server.js');

// pass passport for config
require ('./config/passport')(passport);

// set the view engine to ejs
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');
	
// config files
var db = require('./config/db');

// mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)

app.use(morgan('dev')); 	// log every request to console
app.use(cookieParser());	// read cookies (needed for auth)

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// required for passport
app.use(session({secret: 'ilove373'})); // session secret
app.use(passport.initialize());
app.use(passport.session());		// persistent login sessions
app.use(flash());					// use connect-flash for flash messages

// routes ==================================================
require('./app/routes')(app, passport); // pass our application into our routes

// start app ===============================================
app.listen(port);	
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app
