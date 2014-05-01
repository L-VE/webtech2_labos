
/**
 * Module dependencies.
 */
require("./db");
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var passport = require('passport'), FacebookStrategy = require('passport-facebook').Strategy;

// VAR VOOR DE GET /ASK OM CHATS OP TE HALEN
var mongoose = require( 'mongoose' );
var Chat     = mongoose.model( 'Chat' );
var allChats = "";


var allQuestions = require('./routes/questions');
var askQuestion = require('./routes/ask');
var moderate = require('./routes/moderate');


var http = require('http');
var path = require('path');

var faye = require('faye');
var app = express();

var facebookUserId = "";




// all environments
app.set('port', process.env.PORT || 3002);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
  app.use(passport.initialize());
  app.use(passport.session());
app.use(app.router);


// VOOR PASSPORT FACEBOOK RETURN
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});





app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


// ROUTES DEFINIEREN
app.get('/', routes.index);
app.get('/users', user.list);
//app.get('/ask', askQuestion.ask);




app.get('/ask', function(req, res){

    //res.render('questions', { title: 'IMD WALL' });
      Chat.find( function ( err, questions, count ){
        allChats = questions;
        console.log(allChats);
          res.render( 'ask', {
            title : 'IMD WALL',
            questions : questions,
            facebookUserID : facebookUserId
          });
      });
	
});



// BIJ HET NAVIGEREN NAAR /QUESTIONS
app.get('/questions', allQuestions.list);
// BIJ HET NAVIGEREN NAA /MODERATOR
app.get('/moderator', function(req, res){

    //res.render('questions', { title: 'IMD WALL' });
      Chat.find( function ( err, questions, count ){
        allChats = questions;
        console.log(allChats);
          res.render( 'moderator', {
            title : 'IMD WALL',
            questions : questions,
            facebookUserID : facebookUserId
          });
      });
  
});



passport.use(new FacebookStrategy({
    clientID: "311747825641524",
    clientSecret: "88978dea32c610c42185bd102cb5c14a",
    callbackURL: /*__dirname + "/auth/facebook/callback"*/ "https://polar-hamlet-4269.herokuapp.com/auth/facebook/callback",
    enableProof: false
  },
  function(accessToken, refreshToken, profile, done) {
    /*User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return done(err, user);
    });*/
	facebookUserId = profile.id;
	return done(null, profile);
	// NU NOG DE PROFILE GEGEVENS OPHALEN
	// DB AAN VASTHANGEN
	// GUI AANPASSEN
  }
));

app.get('/auth/facebook',passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' ,  display: 'touch'}),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/ask');
  });

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var bayeux = new faye.NodeAdapter({mount: '/faye'});

bayeux.attach(server);
server.listen('3002');

// test authentication
function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
res.redirect('/ask');
}