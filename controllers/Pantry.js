(function(){
  "use strict";

  var base = require("./base.js"),
      ViewClass = require("../views/Pantry.js"),

      PantryCtrl, _ptype;

  PantryCtrl = function(schemas){
    this.schemas = schemas;

    this.payload = {title: "Your Pantry | Spence"};
    this._view   = new ViewClass();
  };

  _ptype = PantryCtrl.prototype = base.getProto("std");
  _ptype._name = "Pantry";

  _ptype.prePrep = function(data, cb){
    this.schemas.PantryItem.find({present: true}, function(err, items){
      if (err){ return cb(err) }
      data.items = items;
      cb();
    });
  };

  module.exports = PantryCtrl;
}());
