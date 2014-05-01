var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//mongoose.connect('mongodb://localhost/laboxDB');
// CONNECTIE NAAR DE ONLINE MONGOHQ DATABANK
mongoose.connect("mongodb://letis:17hub@oceanic.mongohq.com:10048/labox");

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
  console.log("Connected to Database ");
});


// SCHEMAS DEFINIEREN
var moderatorSchema= new Schema({
                          id:  Number,
                          username: String,
                          password:   String
});

var chatSchema = new Schema({
                          id:  Number,
                          sender: String,
                          chatTime: { type: Date, default: Date.now },
                          votes : Number,
                          message : String,
                          chatType : { type: String, default: "question" }

});

mongoose.model( 'Moderator', moderatorSchema );
mongoose.model( 'Chat', chatSchema );



