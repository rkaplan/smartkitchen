(function(){
  "use strict";

  var base = require("./base.js"),
      async = require("async"),

      InventoryCtrl, _ptype;

  InventoryCtrl = function(schemas){
    this.schemas = schemas;
    this.payload = {};
  };

  _ptype = InventoryCtrl.prototype = base.getProto("api");
  _ptype._name = "Inventory";

  _ptype.itemsRemoved = function(removed, cb){
    if (!removed || removed.length === 0){ // drain won't fire
      return cb();
    }

    var self = this;
    var queue = async.queue(function(item, cb){
      self.schemas.PantryItem.findOne({barcode: item.id}, function(err, dbItem){
        if (err){ return cb(err) }
        if (!dbItem){ return cb({statusCode: 404}); }

        dbItem.present = false;
        dbItem.lastPresent = new Date().getTime();

        dbItem.save(cb);
      });
    });

    queue.drain = cb;
    queue.push(removed);
  };

  _ptype.itemsPresent = function(added, cb){
    if (!added || added.length === 0){ // drain won't fire
      return cb();
    }

    var self = this;
    var queue = async.queue(function(item, cb){
      self.schemas.PantryItem.findOne({barcode: item.id}, function(err, dbItem){
        if (err){ return cb(err) }
        if (!dbItem){ return cb({statusCode: 404}); }

        dbItem.present = true;
        dbItem.location = item.location;

        dbItem.save(cb);
      });
    });

    queue.drain = cb;
    queue.push(added);
  };

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
