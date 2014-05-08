
/*
 * GET home page.
 */

 // BIJ HET SURFEN NAAR DE "/" INDEX, WORDT DE INLOG PAGINA GETOOND

exports.index = function(req, res){
  res.render('index', { title: 'IMD WALL' });
};