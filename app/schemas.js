(function(){
  "use strict";
  var mongoose = require("mongoose"),
      _        = require("underscore"),

      Schema   = mongoose.Schema,
      ObjectId = Schema.Types.ObjectId,
      Mixed    = Schema.Types.Mixed,
      updateTime;

  updateTime = function(next){
    this.updated_at = new Date().getTime();
    next();
  };

  var PantryItem = new Schema({
    name: {type: String, index: true},
    barcode: {type: Number, unique: true},
    description: String,
    manufacturer: String,
    brand: String,
    category: String,
    image: String,
    full_weight: Number,
    current_weight: Number,
    updated_at: Number,
    version: {type: Number, "default": 1}
  });

  PantryItem.pre("save", updateTime);

  exports.PantryItem = mongoose.model("PantryItem", PantryItem);
}());
