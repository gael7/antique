// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var routes= require("./controllers/antique_controller.js");
var logger = require("morgan");
var mongoose = require("mongoose");
var router = express.Router();
var User = require("./models/User.js");

// Mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");

mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Make public a static dir
app.use(express.static(process.cwd() + '/public'));

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

//app.use('/antique/*', expressJwt({secret: 'antique'}));
/*app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.send(401, 'invalid token...');
    }
});*/

app.use("/", routes);
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

// Init server
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
