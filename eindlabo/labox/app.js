
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
var ChatCount = mongoose.model('ChatCount');
var Moderator = mongoose.model('Moderator');
var allChats = "";


var allQuestions = require('./routes/questions');
var askQuestion = require('./routes/ask');
var moderate = require('./routes/moderate');


var http = require('http');
var path = require('path');

var faye = require('faye');
var app = express();

var facebookUserId = "";
var userDisplayName = "";
var userFirstName = "" ;
var userLastName = "" ;
var userName = "";


var moderatorLoggedIn = false;
var userLoggedIn = false;




// VOOR PASSPORT FACEBOOK RETURN
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//callback urls voor lokaal en remote te testen
var callbackURLLocal = "http://localhost:3002/auth/facebook/callback";
var callbackURLRemote = "http://polar-hamlet-4269.herokuapp.com/auth/facebook/callback";

passport.use(new FacebookStrategy({
    clientID: "311747825641524",
    clientSecret: "88978dea32c610c42185bd102cb5c14a",
    callbackURL: /*__dirname + "/auth/facebook/callback"*/ callbackURLLocal,
    profileFields: ['id', 'displayName', 'photos']
  },
  function(accessToken, refreshToken, profile, done) {
    /*User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return done(err, user);
    });*/
   
      process.nextTick(function () {
        
          facebookUserId = profile.id;
          userDisplayName = profile.displayName;
          userFirstName = profile.givenName ;
          userLastName = profile.familyName  ;
          userName = profile.name  ;
          userLoggedIn = true;
          //console.log(facebookUserId);
         return done(null, profile);
       });
  // NU NOG DE PROFILE GEGEVENS OPHALEN
  // GUI AANPASSEN
  }
));


// all environments
app.set('port', process.env.PORT || 3002);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use( express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
  app.use(passport.initialize());
  app.use(passport.session());
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}




app.get('/auth/facebook',passport.authenticate('facebook') ,
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

/*app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/ask');
  });*/

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/ask',
  failureRedirect: '/'
}));


// ROUTES DEFINIEREN
app.get('/', routes.index);
//app.get('/users', user.list);
//app.get('/ask', askQuestion.ask);



// BIJ HET NAVIGEREN NAAR /ASK
app.get('/ask'/*, ensureAuthenticated*/, function(req, res){
    if(userLoggedIn)
    {
        //var user = req.user;
        var user = { username : userFirstName, name : userName, displayname :userDisplayName , familyName :userLastName };

        var totalMessagesSent = 0;
          ChatCount.find({}, function(err, chatCounts){
                        
                        //console.log(chatCounts);
            totalMessagesSent = chatCounts[0].messagesCount;   
        });

        //res.render('questions', { title: 'IMD WALL' });
          Chat.find({}).sort('-votes').execFind( function ( err, questions, count ){
            allChats = questions;
            //console.log(allChats);
              res.render( 'ask', {
                title : 'IMD WALL',
                questions : questions,
                facebookUserID : facebookUserId,
                count : totalMessagesSent,
                userImg : "https://graph.facebook.com/" + facebookUserId + "/picture?type=large",
                user: user
              });
          }); 
          }
      else
      {
        res.redirect('/');
      } 
  
});


//BIJ HET MAKEN VAN EEN CHAT IN /ASK
app.post( '/create', askQuestion.create );

// BIJ HET NAVIGEREN NAAR /QUESTIONS
app.get('/questions', allQuestions.list);
// BIJ HET NAVIGEREN NAA /MODERATOR
app.get('/moderator', function(req, res){

    //res.render('questions', { title: 'IMD WALL' });
    if(moderatorLoggedIn)
    {


        Chat.find({}).sort('-votes').execFind( function ( err, questions, count ){
          allChats = questions;
          //console.log(allChats);
            res.render( 'moderator', {
              title : 'IMD WALL',
              questions : questions,
              facebookUserID : facebookUserId,
              count : allChats.length
            });
        });
    }
    else
    {
      res.redirect('/');
    }
  
});

//app.delete( '/destroy', moderate.destroy );
app.post('/destroy/:id', function (req, res){
  var result = false;
   Chat.find({ id : req.params.id}, function (err, chat) {

     Chat.remove(function (err) {
      if (!err) 
      {
        console.log("removed");
         res.send(JSON.stringify(true));

      } 
      else 
      {
        console.log(err);
        res.send(JSON.stringify(false));
      }
    });
  });

  
});

app.post('/vote/:id/:vote', function (req, res){
  return Chat.find({ id : req.params.id}, function (err, chat) {
        console.log(req.params.id);
        console.log(req.params.vote);
          var conditions = { id: req.params.id }
          , update = { votes : req.params.vote}
          , options = { multi: true };

        Chat.update(conditions, update, options, callback);

        function callback (err, numAffected) {
                // numAffected is the number of updated documents
            if(!err)
              console.log("geupdated");
            else
              console.log(err);
        };

          
  });
});


app.post('/loginMod/:username/:password', function(req, res){
  var name = req.params.username;
  var pass = req.params.password;

  Moderator.find({}, function (err, docs) {
    console.log(docs);
    var found = "";
    for (var i = 0; i < docs.length; i++)
     {
       if(docs[i].username == name && docs[i].password == pass)
       {
           found = true;
           moderatorLoggedIn = true;

       }
       else
       {
         found = false;
         moderatorLoggedIn = false;
       }
    };

      res.send(JSON.stringify(found));
       
  });

  //console.log(name + ' ' + pass);
});

app.get('/logout', function(req, res){
  console.log(req.logout());
  moderatorLoggedIn = false;
  userLoggedIn = false;
  req.logout();
  res.redirect('/');
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var bayeux = new faye.NodeAdapter({mount: '/faye'});

bayeux.attach(server);
server.listen('3002');

// test authentication
function ensureAuthenticated(req, res, next) {
  console.log(req.isAuthenticated());

if (req.isAuthenticated()) { return next(); }
res.redirect('/');
}