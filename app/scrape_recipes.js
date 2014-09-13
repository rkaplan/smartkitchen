(function(){
  "use strict";

  var async = require('async');
  var request = require('request');
  var _ = require('underscore');

  var ALL_RECIPES_API_URL = 'https://www.kimonolabs.com/api/7wfewf7s?apikey=phnNijiHMTPoYSRFBLezmiaYpCmkSzpI';
  var SPECIFIC_RECIPE_API_URL = 'https://www.kimonolabs.com/api/6bd74bcg?apikey=phnNijiHMTPoYSRFBLezmiaYpCmkSzpI';

  var RECIPE_URL_PREFIX = 'http://allrecipes.com/Recipe/';
  var MAX_NUM_INGREDIENTS = 5;

  //
  // Example query for keyword "sandwich" with ingredients "salami", "salt":
  // https://www.kimonolabs.com/api/7wfewf7s?apikey=phnNijiHMTPoYSRFBLezmiaYpCmkSzpI&wt=sandwich&w0=salami&w1=salt&w2=&w3=&w4=
  //
  // Note all parameters must be specified or set to the empty string. They cannot be excluded from the search URL.
  //
  function build_params(ingredients, keyword) {
    var params = '&wt=' + (keyword ? encodeURI(keyword) : '');
    for (var i = 0; i < MAX_NUM_INGREDIENTS; i++) {
      params += '&w' + i.toString() + '=' + (i < ingredients.length ? encodeURI(ingredients[i]) : '');
    }
    // console.log(params)
    return params;
  }

  function recipe_name(recipe) {
    var url = recipe.title.href;
    var start = RECIPE_URL_PREFIX.length;
    return url.substring(start, url.indexOf('/', start));
  }

  function get_all_recipes(ingredients, cb) {
    var queryURL = ALL_RECIPES_API_URL + build_params(ingredients);
    request(queryURL, function(err, response, body) {
      if (err) return cb(err);
      if (response.statusCode == 200) {
        // console.log(body);
        body = JSON.parse(body);
        if (body.lastrunstatus === 'failure') {
          return cb({'lastrunstatus': 'failure'});
        }
        cb(err, body['results']['collection1']);
      }
      else { 
        return cb({ statusCode: response.statusCode });
      };
    });
  }

  function get_first_recipe_query(ingredients, cb) {
    get_all_recipes(ingredients, function(err, recipes) {
      if (err) return cb(err);
      var recipeQuery = SPECIFIC_RECIPE_API_URL + '&kimpath2=' + recipe_name(recipes[0]);
      cb(err, recipes[0], recipeQuery);
    });
  }

  function to_schemafied_recipe(recipe) {
    return {
      title: recipe.title.text,
      href: recipe.title.href.substring(0, recipe.title.href.indexOf('?')),
      thumbnail: recipe.thumbnail.src,
      ingredients: recipe.ingredients,
      ingredient_names: _.map(recipe.ingredients, function(ingr) {
        return ingr.name;
      })
    };
  }

  function get_first_recipe(ingredients, cb) {
    get_first_recipe_query(ingredients, function(err, recipe, recipeQuery) {
      if (err) return cb(err);
      request(recipeQuery, function(err, response, body) {
        if (err) return cb(err);
        if (response.statusCode == 200) {
          var ingredient_entries = JSON.parse(body)['results']['collection1'];
          var normalized_entries = _.map(ingredient_entries, function(entry) {
            var newLineIdx = entry.ingredient.indexOf('\n');
            return {
              'quantity': entry.ingredient.substring(0, newLineIdx),
              'name': entry.ingredient.substring(newLineIdx + 1).split(',', 1)[0].toLowerCase()
            };
          });
          recipe.ingredients = normalized_entries;
          cb(err, to_schemafied_recipe(recipe));
        } else {
          return cb({ statusCode: response.statusCode });
        }
      });
    });
  }

  exports.get_first_recipe = get_first_recipe

}());