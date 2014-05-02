/*var mongoose = require( 'mongoose' );
var Chat     = mongoose.model( 'Chat' );
*/
exports.list = function(req, res){
  res.render('moderator', { title: 'IMD WALL' });
};

exports.destroy = function ( req, res ){
 /* Chat.findById( req.body.id, function ( err, chat ){
    chat.remove( function ( err, todo ){
      //res.redirect( '/moderator' );
      console.log("delete gelukt");
    });
  });*/

  /*Chat.findOne({ id: req.body.id}, function (err, chat){
  	chat.remove( function ( err, todo ){
      if(! err)
      	console.log("delete gelukt");
      else
      	console.log("delete niet gelukt");
    });
  });*/
	var conditions = { id: req.body.id }
	, options = { multi: true };

	Chat.findOneAndRemove(conditions, callback);

	function callback (err, numAffected) {
							  // numAffected is the number of updated documents
							  if(!err)
          							console.log("gedeleted");
          						else
          							console.log(" niet gedeleted");
							};

};