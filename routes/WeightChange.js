(function(){
  "use strict";

  var _ = require("underscore"),
                    handlePost,
                    handler, dispatch;

  var milkCode = "23313",
      say;

  handlePost = function(req, res, next){
    if (req.body.added){
      req._schemas.PantryItem.findOne({barcode: milkCode}, function(err, item){
        if (err){ return next(err) }
        if (!item){
          return next(404);
        }
        item.present = true;
        item.save();
        say(req._io, "You just drank " + getRandomInt(80, 120) + " calories of milk.");
        res.json({_err: 0});
      });
    } else if (req.body.removed){
      req._schemas.PantryItem.findOne({barcode: milkCode}, function(err, item){
        if (err){ return next(err) }
        if (!item){
          return next(404);
        }

        item.present = false;
        item.save();
        res.json({_err: 0});
      });
    }
  };

  say = function(io, msg){
    io.emit("say", {
      msg: msg
    });
  };

  dispatch = {POST: handlePost};
  handler = function(req, res, next){
    if (_.has(dispatch, req.method)){
      return dispatch[req.method](req, res, next);
    }

    return next(405);
  };

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  module.exports = handler;
}());
