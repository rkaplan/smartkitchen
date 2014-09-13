(function(){
  "use strict";

  var base = require("./base.js"),
      ViewClass = require("../views/Speak.js"),

      SpeakCtrl, _ptype;

  SpeakCtrl = function(){
    this.payload = {title: ""};
    this._view   = new ViewClass();
  };

  _ptype = SpeakCtrl.prototype = base.getProto("std");
  _ptype._name = "Speak";

  module.exports = SpeakCtrl;
}());
