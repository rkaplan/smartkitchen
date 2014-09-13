// this file exports the validate method which is used by the api routes to validate the api parameters
(function(){
  "use strict";

  var _ = require("underscore"), fnMap,

  // functions
  validate, validatePresenceOf, validateEmail,
  validateNumber, validateDate, validateTime, validateUrl, validatePhone;


  validate = function(data, spec, returnData){
    var errors = [];
    for (var i = 0; i < spec.length; i++){
      var fn = fnMap[spec[i].type];
      var name = spec[i].name;
      var val  = data[name];

      if (spec[i].optional && !validatePresenceOf(val)){
        continue;
      }

      if (spec[i].array){
        if (!_.isArray(val)){
          errors.push(spec[i].msg);
        } else {
          var valid = true;
          for (var j = 0; j < val.length; j++){
            if (!fn(val[j])){
              errors.push(spec[i].msg);
              valid = false;
              break;
            }
          }

          if (valid){
            // entire array was valid
            returnData[name] = val;
          }
        }
      } else {
        if (!fn(data[spec[i].name])){
          errors.push(spec[i].msg);
        } else {
          returnData[spec[i].name] = data[spec[i].name];
        }
      }
    }
    return ((errors.length === 0) ? null : errors);
  };

  validatePresenceOf = function(value){
    return value && value !== "" && !_.isUndefined(value);
  };

  validateEmail = function(value){
    var emailRegex = new RegExp(/[a-zA-Z0-9._\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,4}$/);
    return emailRegex.test(value);
  };

  validateNumber = function(value){
    return !_.isNaN(parseInt(value, 10));
  };
  validateDate = function(val){
    if (!validatePresenceOf(val)){ return false }
    var match;
    match = val.match(/\d{2}\/\d{2}\/\d{2}/);
    return (match !== null && val === match[0]);
  };

  validateUrl = function(val){
    if (!validatePresenceOf(val)){ return false }
    var match;
    match = val.match(/^(https?:\/\/)?([\da-z\.\-]+)\.([a-z\.]{2,6})([\/\w \.\-]*)*\/?$/);
    return (match !== null && val === match[0]);
  };
  validateTime = function(val){
    if (!validatePresenceOf(val)){ return false }
    var match = val.match(/\d{2}\:\d{2} [AP]M/);
    return (match !== null && val === match[0]);
  };
  validatePhone = function(val){
    if (!validatePresenceOf(val)){ return false }
    var match = val.match(/^\+\d{1,4} \d+$/i);
    return (match !== null && val === match[0]);
  };

  // maps data types to their validation functions
  fnMap = {
    presence: validatePresenceOf,
    email: validateEmail,
    number: validateNumber,
    date: validateDate,
    time: validateTime,
    url: validateUrl,
    phone: validatePhone
  };

  module.exports = validate;
}());
