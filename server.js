// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var routes= require("./controllers/antique_controller.js");
var logger = require("morgan");
var mongoose = require("mongoose");
//var passport = require("passport");
//var session = require("express-session");
//var MongoStore = require("connect-mongo")(session);
//var cookieParser = require("cookie-parser");
//var LocalStrategy = require('passport-local').Strategy;
//var User = require("./models/User.js");


// Mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");

mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: false}));
//app.use(cookieParser());
/*app.use(session({secret: "antique",
      resave: true,
      saveUninitialized: true,
      store: new MongoStore({ mongooseConnection: mongoose.connection,
				 							ttl: 2 * 24 * 60 * 60 })
    }
  )
);
*/
//app.use(passport.initialize());
//app.use(passport.session());

// Make public a static dir
app.use(express.static(process.cwd() + '/public'));

/*app.use(function(req, res, next){
	console.log(req.session);
	console.log("===================");
	console.log(req.user);
	next();
});*/

//Database configuration with mongoose
//"mongodb://localhost/antique"
//"mongodb://heroku_tkb9q367:47puamlbi6s6ge5hrocosore7h@ds117839.mlab.com:17839/heroku_tkb9q367"
mongoose.connect("mongodb://heroku_tkb9q367:47puamlbi6s6ge5hrocosore7h@ds117839.mlab.com:17839/heroku_tkb9q367");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

app.use(methodOverride('_method'));

app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use("/", routes);
// Init server
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d", this.address().port);
});
