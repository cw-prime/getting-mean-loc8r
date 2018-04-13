/* GET 'about' page */
module.exports.about = function(req, res) {
  res.render('generic-text', {title: 'About'});
};

/* GET 'Angular SPA' page */
module.exports.angularApp = function(req, res) {
  res.render('layout', {title: 'Loc8r'});
};