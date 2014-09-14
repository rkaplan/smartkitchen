(function(){
  "use strict";

  var base = require("./base.js"),
      recipes = require("../app/find_recipes.js"),

      RecipesCtrl, _ptype;

  RecipesCtrl = function(schemas){
    this.schemas = schemas;
    this.payload = {};
  };

  _ptype = RecipesCtrl.prototype = base.getProto("api");
  _ptype._name = "Recipes";

  _ptype.prePrep = function(data, cb){
    this.schemas.PantryItem.find({present: true}, function(err, items){
      if (err){ return cb(err) }

      var names = [];
      for (var i = 0; i < items.length; i++){
        names.push(items[i].name);
      }
      recipes.find_recipe(names, function(err, recipe){
        if (err){ return cb(err) }
        console.log(recipe);
        data.recipe = recipe;
        cb();
      });
    });
  };

  module.exports = RecipesCtrl;
}());
