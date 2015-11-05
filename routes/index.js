var express = require('express');
var router = express.Router();
var thesaurus = require('thesaurus');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Essay Expander by Tyler' });
});

module.exports = router;
