(function(){
  "use strict";
  
  var base = require("./base.js");


  var InventoryView, _ptype;

  InventoryView = function(){};

  _ptype = InventoryView.prototype = base.getProto("std");
  _ptype._view_name = "InventoryView";
  _ptype._template  = "Inventory.jade";

  module.exports = InventoryView;
}());
