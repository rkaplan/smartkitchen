(function(){
  "use strict";

  var _ = require("underscore"),
      handleGet,
      handler, dispatch,

    ControllerClass = require("../controllers/Recipes.js");

  handleGet = function(req, res, next){
    var control = new ControllerClass(req._schemas);

    var params = {};

    control.renderData(res, params);
  };

  dispatch = {GET: handleGet};
  handler = function(req, res, next){
    if (_.has(dispatch, req.method)){
      return dispatch[req.method](req, res, next);
    }

    return next(405);
  };

  module.exports = handler;
}());
