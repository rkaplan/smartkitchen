(function(){
  "use strict";

  var schemas = require('../app/schemas.js'),
      conf = require('nconf').argv().env().file({file: __dirname + '/../config.json'}),
      mongoose = require('mongoose'),
      recipes = require('../app/scrape_recipes.js');

  mongoose.connect(conf.get("mongo"));

  function makeRecipe(data) {
    var recipe = new schemas.Recipe(data);
    recipe.save(function (err, document) {
        if (err) {
            console.log('error');
            return;
        }
        console.log(JSON.stringify(data));
        console.log('successfully saved ' + data.title);
    });
  }

  recipes.get_first_recipe(['salt', 'garlic', 'parsley'], function(err, recipe) {
    if (err) {
      if (err.hasOwnProperty('lastrunstatus')) {
        console.log('ERROR: lastrunstatus: ' + err.lastrunstatus);
      }
    }
    makeRecipe(recipe)
  });

}());