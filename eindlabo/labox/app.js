
/**
 * Module dependencies.
 */

 // ALLE MODULES DEPENDENCIES INSTELLEN
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
// OM ZO DE USER PROPERTIES TE KUNNEN OPVRAGEN
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


//CALLBACK URLS OM ZO REMOTE EN LOCAL TE KUNNEN DEVELOPPEN
var callbackURLLocal = "http://localhost:3002/auth/facebook/callback";
var callbackURLRemote = "http://polar-hamlet-4269.herokuapp.com/auth/facebook/callback";

// PASSPORT FACEBOOK LOGIN INSTELLEN
passport.use(new FacebookStrategy({
    clientID: "311747825641524",
    clientSecret: "88978dea32c610c42185bd102cb5c14a",
    callbackURL: /*__dirname + "/auth/facebook/callback"*/ callbackURLRemote,
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


// DE FACEBOOK AUTHENTIFICATIE INSTELLEN

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


// ALLE ROUTES DEFINIEREN
app.get('/', routes.index);
//app.get('/users', user.list);
//app.get('/ask', askQuestion.ask);



// BIJ HET NAVIGEREN NAAR /ASK
// MOETEN ALLE VORIGE POSTS AL WORDEN OPGEHAALD EN DOORGEGEVEN WORDEN NAAR DE VIEW
// ENKEL ALS DE USER IS INGELOGD
// MET SORTERING VAN DE VOTES VAN HOOG NAAR LAAG
// OOK HET TOTALE AANTAL POSTS WORDT MEEGEGEVEN NAAR DE VIEW OM ZO EEN UNIEKE ID TE KUNNEN MEEGEVEN
// AAN DE NIEUWE AANGEMAAKTE POST
// OOK DE FACEBOOK PROFILE ID WORDT MEEGEGEVEN OM DEZE TE KUNNEN MEEGEVEN IN DE DATABANK VAN WIE DE SENDER IS
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
// ZIE VERDER IN ASK.JS
app.post( '/create', askQuestion.create );

// BIJ HET NAVIGEREN NAAR /QUESTIONS
// ZIE VERDER IN QUESTIONS.JS
app.get('/questions', allQuestions.list);

// BIJ HET NAVIGEREN NAA /MODERATOR
// WORDEN ALLE VORIGE POSTS OPGEHAALD
// ENKEL ALS DE MODERATOR IS INGELOGD
// MET SORTERING VAN DE VOTES VAN HOOG NAAR LAAG
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

// BIJ HET VERWIJDEREN VAN EEN POST WORDT DE ID MEEGEGEVEN
// OM ZO DE JUISTE MATCH TE VINDEN EN DEZE DAN TE VERWIJDEREN
app.post('/destroy/:id', function (req, res){
  var result = false;
  /* Chat.findOne ({ id : req.params.id}, function (err, chat) {
    console.log(req.params.id);
    console.log(chat);
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
*/

Chat.findOne({ id : req.params.id}, function (err, chat) {
        //console.log(req.params.id);

        Chat.findOne({ id : req.params.id}).remove(callback);

        function callback (err, numAffected) {
                // numAffected is the number of updated documents
            if (!err) 
            {
              //console.log("removed");
               res.send(JSON.stringify(true));

            } 
            else 
            {
              //console.log(err);
              res.send(JSON.stringify(false));
            }
        };

          
  });
  
});

// BIJ HET VOTEN WORDT DE JUISTE ID MEEGEGEVEN
// OM DE OVEREENKOMSTIGE POST IN DE DATABANK TE UPDATEN MET DE JUISTE VOTE VALUE
app.post('/vote/:id/:vote', function (req, res){
  var result = false;
  return Chat.find({ id : req.params.id}, function (err, chat) {
        //console.log(req.params.id);
        //console.log(req.params.vote);
          var conditions = { id: req.params.id }
          , update = { votes : req.params.vote}
          , options = { multi: true };

        Chat.update(conditions, update, options, callback);

        function callback (err, numAffected) {
                // numAffected is the number of updated documents
            if(!err)
              //console.log("geupdated");
              result = true;
            else
              //console.log(err);
              result = false;
        };

          
  });
});


// BIJ HET INLOGGEN WORDT ER GECHECKT OF DE INLOGGEGEVENS
// OVEREENKOMEN MET DE ADMINS IN DE DATABANK
// WANNEER ZE OVEREENKOMEN DAN WORDT DE ADMIN NAAR DE VOLGENDE PAGINA GELEID
// ANDERS NIET
app.post('/loginMod/:username/:password', function(req, res){
  var name = req.params.username;
  var pass = req.params.password;

  Moderator.find({}, function (err, docs) {
    //console.log(docs);
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

// BIJ HET SURFEN NAAR DE /LOGOUT URL WORDT DE 
// HUIDIGE USER UITGELOGD EN GEREDIRECT NAAR DE INDEX PAGINA
app.get('/logout', function(req, res){
  //console.log(req.logout());
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