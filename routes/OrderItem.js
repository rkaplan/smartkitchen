(function(){
  "use strict";

  var _ = require("underscore"),
      handlePost,
      handler, dispatch;

  handlePost = function(req, res, next){
    debugger;
    req._io.emit("order_item", {
      name: req.body.name
    });
    return res.json({
      _err: 0
    });
  };

  dispatch = {POST: handlePost};
  handler = function(req, res, next){
    debugger;
    if (_.has(dispatch, req.method)){
      return dispatch[req.method](req, res, next);
    }

    return next(405);
  };

  module.exports = handler;
}());
