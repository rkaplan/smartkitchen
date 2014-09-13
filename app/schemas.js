(function(){
  "use strict";
  var mongoose = require("mongoose"),
      _        = require("underscore"),

      Schema   = mongoose.Schema,
      ObjectId = Schema.Types.ObjectId,
      Mixed    = Schema.Types.Mixed,
      updateTime;

  updateTime = function(next){
    this.updatedAt = new Date().getTime();
    next();
  };

  var PantryItem = new Schema({
    name: {type: String, index: true},
    id: {type: Number, unique: true},
    description: String,
    manufacturer: String,
    brand: String,
    category: String,
    image: String,
    full_weight: Number,
    current_weight: Number,
    updatedAt: Number,
    version: {type: Number, "default": 1}
  });

  PantryItem.pre("save", updateTime);

  exports.PantryItem = mongoose.model("PantryItem", PantryItem);
}());
