
/*
 * GET home page.
 */
var mongoose = require( 'mongoose' );
var db = mongoose.connection;
var Chat     = mongoose.model( 'Chat' );
var ChatCount = mongoose.model('ChatCount');


exports.ask = function(req, res){

  res.render('ask', { title: 'IMD WALL' });
};

exports.vote = function(req, res){

 
};



exports.create = function ( req, res ){
  new Chat({
		    id    : req.body.chatContent.id,
		    sender : req.body.chatContent.sender,
		    votes : 0,
		    message : req.body.chatContent.message,
		    chatType : req.body.chatContent.chatType,
		    chatTime : Date.now()
	  }).save( function( err, question, count ){
	  	var mesCount = "";
	  		if(! err)
	  		{
	  			console.log("insert gelukt");

			  	
				  	/* Chat.find( function ( err, questions, count ){
				       if(! err)
				       {
				       		 allChats = questions;
					        //console.log(allChats);
					        mesCount = allChats.length;
					        mesCount++;
					        console.log(err + ' - ' + questions + ' - ' + count);
				       }
				      });
					*/
				  	 	/*ChatCount.find({ description : "count"}, function(err, chatCounts){
          					console.log(chatCounts);
       					 });*/

	  					ChatCount.find({}, function(err, chatCounts){
          					
          					//console.log(chatCounts);
	  						var count = chatCounts[0].messagesCount;
          					count++;

	  						var conditions = { id: 1 }
							  , update = { messagesCount : count}
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

	  		

	  		}
		  	
		    //res.redirect( '/ask' );
	  });
};