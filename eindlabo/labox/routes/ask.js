
/*
 * GET home page.
 */
var mongoose = require( 'mongoose' );
var db = mongoose.connection;
var Chat     = mongoose.model( 'Chat' );
var ChatCount = mongoose.model('ChatCount');


exports.ask = function(req, res){

  res.render('askQuestion', { title: 'IMD WALL' });
};




exports.create = function ( req, res ){
  new Chat({
		    id    : req.body.chatContent.id,
		    sender : req.body.chatContent.sender,
		    votes : 0,
		    message : req.body.chatContent.message,
		    chatType : req.body.chatContent.chatType,
		    chatTime : Date.now(),
		    senderPicURL : req.body.chatContent.senderPicURL
	  }).save( function( err, question, count ){
	  	var mesCount = "";
	  		if(! err)
	  		{
	  			console.log("insert gelukt");

	  					ChatCount.find({}, function(err, chatCounts){
          					
          					//console.log(chatCounts);
	  						var count = chatCounts[0].messagesCount;
          					count++;
          					var defaultMessagesCount = 0;

          					/*hier de messagesCount op 0 zetten als begin,
          					wanneer er nog geen chats in de databank zouden zitten*/
	  						var conditions = { id: 1 }
							  , update = { messagesCount : count }
							  , options = { multi: true };

							ChatCount.update(conditions, update, options, callback);

							function callback (err, numAffected) {
							  // numAffected is the number of updated documents
							  if(!err)
          							console.log("gesaved");
          						else
          							console.log(" niet gesaved");
							};

          					
       					 });
	  					res.send(JSON.stringify(true));
	  		}
	  		else
	  		{
	  			res.send(JSON.stringify(false));
	  		}
		  	
		    //res.redirect( '/ask' );
	  });


};