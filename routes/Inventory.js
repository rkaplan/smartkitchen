(function(){
  "use strict";

  var _ = require("underscore"),
      handlePost,
      handler, dispatch,

      ControllerClass = require("../controllers/Inventory.js");

  handlePost = function(req, res, next){
    var controller = new ControllerClass(req._schemas);
    controller.addItem(req.body, function(err, item){
      if (err){
        return res.json(500, {_err: err});
      }
      return res.json({
        _err: 0,
        id: item.id
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
