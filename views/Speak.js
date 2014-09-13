(function(){
  "use strict";
  
  var base = require("./base.js");


  var SpeakView, _ptype;

  SpeakView = function(){};

  _ptype = SpeakView.prototype = base.getProto("std");
  _ptype._view_name = "SpeakView";
  _ptype._template  = "speak.jade";

  module.exports = SpeakView;
}());
