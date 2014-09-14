(function(){
  "use strict";

  var schemas = require('../app/schemas.js'),
      conf = require('nconf').argv().env().file({file: __dirname + '/../config.json'}),
      mongoose = require('mongoose'),
      _ = require('underscore');

  //mongoose.connect(conf.get("mongo"));

  function find_saved_recipe_with_all_ingredients(ingredients, cb) {
    schemas.Recipe.findOne({ingredient_names : {'$all' : ingredients }}, function(err, doc) {
      if (err){ return cb(err); }
      return cb(null, doc);
    });
  }

  function find_saved_recipe(ingredients, cb) {
    // var possibleIngredientSets = makeSmallerSets(ingredients);
    // TODO: figure out subsets of ingredients that we can find recipes for

    find_saved_recipe_with_all_ingredients(ingredients, cb);
  }

  function find_new_recipe_by_scraping(ingredients, cb) {
    cb({not_yet_implemented: true});
  }

  function find_recipe(ingredients, cb) {
    ingredients = _.map(function(ingr) { return ingr.toLowerCase(); });
    find_saved_recipe(ingredients, function(err, recipe) {
      if (err){ return cb(err); }
      if (recipe === null) {
        find_new_recipe_by_scraping(ingredients, function(err, recipe) {
          if (err){ return cb(err); }
          else {
            console.log('TODO: implement live scraping search as a fallback if our DB has no good results');
          }
        });
      } else {
        // successfully found a recipe in the database
        cb(null, recipe);
      }
    });
  }

  // Example call:
  //
  // find_recipe(['tomato sauce', 'salt'], function(err, result) {
  //   console.log(err);
  //   console.log(result);
  // });
  exports.find_recipe = find_recipe;

}());
