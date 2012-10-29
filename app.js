/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , hit = require('./routes/hit')
  , http = require('http')
  , path = require('path');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.post('/hit', hit.doHit);
app.get('/hit/:section/:type/:start/:end/:tag/:numResults', hit.find):

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
