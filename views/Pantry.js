(function(){
  "use strict";

  var base = require("./base.js");

  var PantryView, _ptype;

  PantryView = function(){};

  _ptype = PantryView.prototype = base.getProto("std");
  _ptype._view_name = "PantryView";
  _ptype._template  = "pantry.jade";

  module.exports = PantryView;
}());
