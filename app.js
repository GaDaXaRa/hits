/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , hit = require('./routes/hit')
  , key = require('./routes/key')
  , hash = require('./routes/hash')
  , test = require('./routes/test')
  , http = require('http')
  , path = require('path');

var MemoryStore = express.session.MemoryStore,
    sessionStore = new MemoryStore();

var mongoose = require('mongoose');
if (!mongoose.connection.db) {
  mongoose.connect('mongodb://localhost/test');
};

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('hitting')); 
  app.use(express.session({store: sessionStore})); 
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/test', test.test);
app.post('/hit', hit.doHit);
app.get('/hit/:section/:type/:days/:tag/:numResults', hit.find);
app.get('/hash/:content/:service/:key', hash.getHash);
app.get('/key', key.create);

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

module.exports = app;