
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var resources = require('./routes/resources');
var relations = require('./routes/relations');
var http = require('http');
var path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 9005);
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

// Define the routes
app.get('/', routes.index);
app.get(/^\/api\/v1\/resources$/, resources.listResources);
app.post(/^\/api\/v1\/resources$/, resources.createResource);
app.get(/^\/api\/v1\/resources\/([a-zA-Z0-9_-]+)$/, resources.getResource);
app.put(/^\/api\/v1\/resources\/([a-zA-Z0-9_-]+)$/, resources.updateResource);
app.delete(/^\/api\/v1\/resources\/([a-zA-Z0-9_-]+)$/, resources.deleteResource);
app.post(/^\/api\/v1\/resources\/([a-zA-Z0-9_-]+)\/content\/([a-zA-Z0-9_-]+)$/, resources.addFile);
app.get(/^\/api\/v1\/resources\/([a-zA-Z0-9_-]+)\/request-upload-url$/, resources.requestUploadUrl);

// New relation api
// https://github.com/AmericanCouncils/AyamelResourceApiServer/issues/84
app.get(/^\/api\/v1\/relations$/, relations.getRelations);
app.post(/^\/api\/v1\/relations$/, relations.createRelation);
app.delete(/^\/api\/v1\/relations\/([a-zA-Z0-9_-]+)$/, relations.deleteRelation);

//app.get(/^\/api\/v1\/resources\/([a-zA-Z0-9_-]+)\/relations$/, resources.getRelations);
//app.post(/^\/api\/v1\/resources\/([a-zA-Z0-9_-]+)\/relations$/, resources.createRelation);


app.options(/^.*$/, resources.options);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
