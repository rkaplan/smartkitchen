(function(){
  "use strict";

  var _ = require("underscore"),
      async = require("async"),
      handlePost, handlePut,
      handler, dispatch, sendPantryUpdate,
      sendToIo,

      ControllerClass = require("../controllers/Inventory.js");

  handlePost = function(req, res, next){
    var controller = new ControllerClass(req._schemas);
    controller.addItem(req.body, function(err, item){
      if (err){
        return res.json(500, {_err: err});
      }
      return res.json({
        _err: 0,
        id: item._id
      });
    });
  };

  handlePut = function(req, res, next){
    var controller = new ControllerClass(req._schemas);
    var body = JSON.parse(req.rawBody);
    console.log("raw body text", req.rawBody);
    console.log("body", body);
    console.log("body", req.body);
    console.log("adding", req.body.added);
    console.log("removing", req.body.removed);
    async.parallel([
      function(cb){ controller.itemsPresent(req.body.added, cb) },
      function(cb){ controller.itemsRemoved(req.body.removed, cb) },
      function(cb){ sendToIo(req._schemas, req._io, req.body, cb) }
    ], function(err){
      if (err){
        return res.json(500, {_err: err});
      }
      return res.json({
        _err: 0
      });
    });
  };

  sendToIo = function(schemas, io, body, cb){
    var added = [];
    if (!body.added){
      io.emit("pantry_update", {
        added: added,
        removed: body.removed
      });
      return cb();
    }

    // need to get added to include item details
    var queue = async.queue(function(item, cb){
      schemas.PantryItem.findOne({barcode: item.id.toString()}, function(err, dbItem){
        if (err){ cb(err) }

        added.push(dbItem);
        cb();
      });
    });
    queue.drain = function(err){
      if (err){ cb(err) }
      io.emit("pantry_update", {
        added: added,
        removed: body.removed
      });
      cb();
    };
    queue.push(body.added);
  };

  dispatch = {POST: handlePost, PUT: handlePut};
  handler = function(req, res, next){
    if (_.has(dispatch, req.method)){
      return dispatch[req.method](req, res, next);
    }

    return next(405);
  };

  module.exports = handler;
}());
