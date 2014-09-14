(function(){
  "use strict";

  var schemas = require('../app/schemas.js'),
      conf = require('nconf').argv().env().file({file: __dirname + '/../config.json'}),
      mongoose = require('mongoose'),
      _ = require('underscore');

  // mongoose.connect(conf.get("mongo"));

  function num_matches(arr1, arr2) {
    var matches = 0;
    for (var i = 0; i < arr1.length; i++) {
      if(arr2.indexOf(arr1[i]) != -1) {
        matches++;
      }
    }
    return matches;
  }

  function find_saved_recipe_with_all_ingredients(ingredients, cb) {
    schemas.Recipe.findOne({ingredient_names : {'$all' : ingredients }}, function(err, doc) {
      if (err){ return cb(err); }
      return cb(err, doc);
    });
  }

  function find_saved_recipe(ingredients, cb) {
    // find_saved_recipe_with_all_ingredients(ingredients, cb);

    schemas.Recipe.find({'ingredient_names' : {'$in' : ingredients}}, function(err, docs) {
      if (err) { return cb(err); }
      if (!docs) { return cb(err, null); }

      var results = [];

      for (var i = 0; i < docs.length; i++) {
        var nmatches = num_matches(docs[i].ingredient_names, ingredients);
        results.push({
          recipe: docs[i],
          num_ingredients_owned: nmatches,
          num_ingredients_needed: docs[i].ingredient_names.length - nmatches
        });
      }

      results.sort(function(a, b) {
        return b.num_ingredients_owned - a.num_ingredients_owned;
      })

      var chosenRecipe = results[0];
      var stillNeeded = [];
      for (var i = 0; i < chosenRecipe.recipe.ingredient_names.length; i++) {
        if (ingredients.indexOf(chosenRecipe.recipe.ingredient_names[i]) === -1) {
          stillNeeded.push(chosenRecipe.recipe.ingredient_names[i]);
        }
      }

      chosenRecipe.ingredients_needed = stillNeeded;
      cb(err, chosenRecipe);
    });
  }

  function find_new_recipe_by_scraping(ingredients, cb) {
    cb({not_yet_implemented: true});
  }

  function find_recipe(ingredients, cb) {
    ingredients = _.map(ingredients, function(ingr) { return ingr.toLowerCase(); });
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
  // find_recipe(['tomato sauce', 'salt', 'crap', 'garlic', 'fekjnsd', 'penne'], function(err, result) {
  //   console.log(err);
  //   console.log(result);
  // });
  exports.find_recipe = find_recipe;

}());
