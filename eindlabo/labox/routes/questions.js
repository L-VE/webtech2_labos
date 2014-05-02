var mongoose = require( 'mongoose' );
var Chat     = mongoose.model( 'Chat' );
var allChats = "";

exports.list = function(req, res){
  //res.render('questions', { title: 'IMD WALL' });
    Chat.find( function ( err, questions, count ){
	allChats = questions;
	console.log(allChats);
    res.render( 'questions', {
      title : 'IMD WALL',
      questions : questions,
      count : allChats.length
    });
  });
};
