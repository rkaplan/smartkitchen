(function(){
  "use strict";

  var _ = require("underscore"),
      request = require("../app/request.js"),
      handlePost,
      handler, dispatch;

  handlePost = function(req, res, next){
    var name = req.body.name;
    req._schemas.PantryItem.findOne({name: name}, function(err, item){
      if (err){ return next(err) }
      if (!item){ return next(404) }
      var options = {
        host: req._conf.get("imp_host"),
        path: req._conf.get("imp_path") + "?led=" + item.location,
        mathod: "GET",
        scheme: "https"
      };
      console.log("doing request", options);
      request.request(options, {}, "", function(err){
        if (err){
          console.error(err);
        }
      });
      return res.json({
        _err: 0
      });
    });
  };

  dispatch = {POST: handlePost};
  handler = function(req, res, next){
    if (_.has(dispatch, req.method)){
      return dispatch[req.method](req, res, next);
    }

    return next(405);
  };

  module.exports = handler;
}());
