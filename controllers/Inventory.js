(function(){
  "use strict";

  var base = require("./base.js"),
      ViewClass = require("../views/Inventory.js"),

      InventoryCtrl, _ptype;

  InventoryCtrl = function(){
    this.payload = {title: ""};
    this._view   = new ViewClass();
  };

  _ptype = InventoryCtrl.prototype = base.getProto("std");
  _ptype._name = "Inventory";

  module.exports = InventoryCtrl;
}());
