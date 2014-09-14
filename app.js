(function(){
  "use strict";
  var express      = require('express'),
      path         = require('path'),
      favicon      = require('static-favicon'),
      logger       = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser   = require('body-parser'),
      conf         = require('nconf').argv().env().file({file: __dirname + '/config.json'}),
      http         = require("http"),
      schemas      = require("./app/schemas.js"),
      socketIo     = require("socket.io"),
      mongoose     = require("mongoose"),
      _            = require("underscore"),

      routes = require("./routes"),

      app = express();

  mongoose.connect(conf.get("mongo"));

  // view engine setup
  app.set('views', path.join(__dirname, 'templates'));
  app.set('view engine', 'jade');

  app.use(favicon());
  app.use(logger('dev'));
  app.use(function(req, res, next) {
    req.rawBody = '';
    req.setEncoding('utf8');

    req.on('data', function(chunk) {
      req.rawBody += chunk;
    });

    req.on('end', function() {
      if (req.rawBody && req.rawBody.length && req.rawBody !== ""){
        try{
          req.body = JSON.parse(req.rawBody);
        } catch (e){
          console.error(e);
          return next(400);
        }
      }
      next();
    });
  });
  //app.use(bodyParser.json());
  //app.use(bodyParser.urlencoded());
  app.use(cookieParser());
  app.use(require('less-middleware')(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, 'public')));

  var server = http.Server(app);
  var io = socketIo(server);

  _.each(routes, function(route){
    var methods = route[5] || ["get"];

    methods.forEach(function(method){
      var params = [];

      if (route[2]){
        params.push(function(req, res, next){
          req._schemas = schemas;
          next();
        });
      }
      if (route[3]){
        params.push(function(req, res, next){
          req._conf = conf;
          next();
        });
      }

      if (route[4]){
        params.push(function(req, res, next){
          req._io = io;
          next();
        });
      }
      app[method](route[0], params, route[1]);
    });
  });

  /// catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  /// error handlers

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
  } else {
    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });
  }

  app.set('port', process.env.PORT || 3000);

  server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
  });
}());
