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
                          chatType : { type: String, default: "question" },
                          senderPicURL : String,
                          facebookID : String,
                          facebookUsername : String

});

var chatCountSchema = new Schema({
                          id:  Number,
                          messagesCount: Number,
                          description : String
});

var votesSchema = new Schema({
                          id:  Number,
                          chat_id: Number,
                          voteValue : String,
                          voteType : String,
                          votedUp : Boolean,
                          votedDown : Boolean,
                          voterFacebookID : String
});


mongoose.model( 'Moderator', moderatorSchema, 'moderator' );
mongoose.model( 'Chat', chatSchema, 'chats' );
mongoose.model( 'ChatCount', chatCountSchema, 'chatcount' );
mongoose.model( 'Votes', votesSchema, 'votes' );



