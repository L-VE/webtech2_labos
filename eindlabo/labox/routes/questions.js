// DE REQUIRED MODULES VERMELDEN

var mongoose = require( 'mongoose' );
var Chat     = mongoose.model( 'Chat' );
var allChats = "";

/*exports.list = function(req, res){
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
};*/

// BIJ HET SURFEN NAAR DE QUESTIONS PAGINA MOETEN ALLE REEDS GESTELDE VRAGEN EN ANTWOORDEN 
// UIT DE DATABANK WORDEN OPGEHAALD
exports.list = function(req, res){
  //res.render('questions', { title: 'IMD WALL' });
    Chat.find({}).sort('-votes').execFind( function ( err, questions, count ){
              allChats = questions;
              //console.log(allChats);
                res.render( 'questions', {
                  title : 'IMD WALL',
                  questions : questions,
                  count : allChats.length
                });
              });

    
};

