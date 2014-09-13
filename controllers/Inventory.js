(function(){
  "use strict";

  var base = require("./base.js"),

      InventoryCtrl, _ptype;

  InventoryCtrl = function(schemas){
    this.schemas = schemas;
    this.payload = {};
  };

  _ptype = InventoryCtrl.prototype = base.getProto("api");
  _ptype._name = "Inventory";

  _ptype.addItem = function (itemData, cb){
    var pantryItem = new this.schemas.PantryItem({
      name: itemData.name,
      barcode: itemData.barcode,
      description: itemData.description,
      manufacturer: itemData.manufacturer,
      brand: itemData.brand,
      category: itemData.category,
      image: itemData.image,
      full_weight: itemData.full_weight,
      current_weight: itemData.full_weight,
      version: 1
    });
    pantryItem.save(cb);
  };


  module.exports = InventoryCtrl;
}());
