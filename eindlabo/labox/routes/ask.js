
/*
 * GET home page.
 */

 // ALLE REQUIRED MODULES INCLUDEN

var mongoose = require( 'mongoose' );
var db = mongoose.connection;
var Chat     = mongoose.model( 'Chat' );
var ChatCount = mongoose.model('ChatCount');

// DEZE FUNCTIE WORDT OOK UITEINDELIJK IN DE APP.JS  UITGEWERKT
exports.ask = function(req, res){

  res.render('askQuestion', { title: 'IMD WALL' });
};



// BIJ HET CREEEREN VAN EEN POST, WORDEN DE JUISTE PROPERTIES INGESTELD
// VOTES KRIJGT BIJ AANMAAK AUTOMATISCH 0		
// OOK BIJ DE AANMAAK VAN EEN POST, WORDT HET AANTAL POSTS IN DE CHATCOUNT COLLECTION
// MET 1 VERHOOGD
// DIT IS HANDIG OM EEN ID TE SETTEN BIJ DE AANMAAK VAN EEN NIEUWE POST, ZODAT
// ER NOOIT 2 POSTS DEZELFDE ID HEBBEN
exports.create = function ( req, res ){
	var result = false;
  new Chat({
		    id    : req.body.chatContent.id,
		    sender : req.body.chatContent.sender,
		    votes : 0,
		    message : req.body.chatContent.message,
		    chatType : req.body.chatContent.chatType,
		    chatTime : Date.now(),
		    senderPicURL : req.body.chatContent.senderPicURL,
        facebookID : req.body.chatContent.facebookUserID,
        facebookUsername : req.body.chatContent.facebookUserName
	  }).save( function( err, question, count ){
	  	var mesCount = "";
	  		if(! err)
	  		{
	  			//console.log("insert gelukt");

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
          							//console.log("gesaved");
          							result = true;
          						else
          							//console.log(" niet gesaved");
          							result = false;
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