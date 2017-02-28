// Dependencies
var express = require("express");
var session= require("express-session");
var exphbs = require("express-handlebars");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var routes= require("./controllers/antique_controller.js");
var logger = require("morgan");
var mongoose = require("mongoose");
var passport = require("passport");
var cookieParser = require("cookie-parser");

require('./passport.js')(passport);


// Mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");
mongoose.Promise = Promise;
Promise.promisifyAll(mongoose);

// Initialize Express
var app = express();

// Use morgan and body parser with our app
  app.use(logger("dev"));
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(cookieParser());
  app.use(express.static(process.cwd() + '/public'));
  app.use(session({secret: 'antique',
                  resave: false,
                  saveUninitialized: true,}));
  app.use(passport.initialize());
  app.use(passport.session());

app.use(methodOverride('_method'));
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Make public a static dir

//Database configuration with mongoose
//"mongodb://localhost/antique"
//"mongodb://heroku_tkb9q367:47puamlbi6s6ge5hrocosore7h@ds117839.mlab.com:17839/heroku_tkb9q367"
mongoose.connect("mongodb://localhost/antique");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


require("./controllers/antique_controller.js")(app, passport);
// Init server
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d", this.address().port);
});
