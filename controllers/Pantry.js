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
      data.rows = getRows(items);

      cb();
    });
  };


  function getRows(items) {
    return items.reduce(function (prev, item, i) {
      if(i % 3 === 0){
        prev.push([item]);
      }else{
        prev[prev.length - 1].push(item);
      }

      return prev;
    }, []);
  }

  module.exports = PantryCtrl;
}());
