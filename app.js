require('dotenv').config()


var express = require("express");
var app = express();
app.set("view engine", "ejs");
var Comment = require("./models/comment");
var bodyParser = require("body-parser");
var commentsRoutes = require("./routes/comments");
var campgroundsRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var seedDB = require("./seed");
var mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/yelp_camp", {
//     useNewUrlParser: true
// });
mongoose.connect("mongodb://joe:Hellsing1@ds211265.mlab.com:11265/joedatabase", {
    useNewUrlParser: true
});

// mongodb://joe:Hellsing1@ds211265.mlab.com:11265/joedatabase


app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(flash());



// seedDB(); //seed the database


//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Joe is the best",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments",commentsRoutes);







//================
//SERVER
//================
app.listen(process.env.PORT || 5000, function () {
    console.log("Yelp Camp server has Started");
})