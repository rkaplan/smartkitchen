(function(){
  "use strict";

  var _ = require("underscore"),
      handlePost,
      handler, dispatch,

      ControllerClass = require("../controllers/Inventory.js");

  handlePost = function(req, res, next){
    
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
