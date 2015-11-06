var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var thesaurus = require('thesaurus');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// This is where the magic happens. 
app.get('/process', function(req, res){
  var inputText = req.query.input;
  var minSynonyms = req.query.min;
  
  // Function for processing each individual word.
  function processWord(word, length) {
  
    var processedWord = {word: word, syn: "" };
    var synonyms = thesaurus.find(word);
    var synonymsArray = [];
  
    function createArray(value, index, ar) {
      var wordCount = value.trim().replace(/\s+/gi, ' ').split(' ').length;
      if (wordCount >= length) {
        synonymsArray.push(value);
      }
    };
  
    synonyms.forEach(createArray);
    
    if (synonymsArray.length !== 0) {
      processedWord = {word: word, syn: synonymsArray };
    } 
    return processedWord;

  };
  
  // Function for processing the entire input. 
  function processInput(str) {
    var input = str;
    var array = input.split(' ');
    var inputWordCount = input.trim().replace(/\s+/gi, ' ').split(' ').length;
    var newString = [];
  
    for (i = 0; i < inputWordCount; i++) {
      newString.push(processWord(array[i], minSynonyms));
    }
    
    return newString;
  }
  
  // Lets respond with the JSON string. We'll let the client figure out the rest
  res.send(JSON.stringify(processInput(inputText)));
  
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
