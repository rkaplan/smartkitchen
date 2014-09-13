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

  recipes.get_first_recipe(['salt', 'condensed milk'], function(err, recipe) {
    if (err) {
      if (err.hasOwnProperty('lastrunstatus')) {
        console.log('ERROR: lastrunstatus: ' + err.lastrunstatus);
      }
    }
    makeRecipe(recipe)
  });

  // makeRecipe({
  //   title: 'Antipasto Pasta Salad',
  //   href: 'http://allrecipes.com/Recipe/Antipasto-Pasta-Salad/Detail.aspx',
  //   thumbnail: 'http://images.media-allrecipes.com/userphotos/140x140/00/65/56/655688.jpg',
  //   ingredients: [
  //    { quantity: '1 pound', name: 'seashell pasta' },
  //    { quantity: '1/4 pound', name: 'genoa salami' },
  //    { quantity: '1/4 pound', name: 'pepperoni sausage' },
  //    { quantity: '1/2 pound', name: 'asiago cheese' },
  //    { quantity: '1 (6 ounce) can', name: 'black olives' },
  //    { quantity: '1', name: 'red bell pepper' },
  //    { quantity: '1', name: 'green bell pepper' },
  //    { quantity: '3', name: 'tomatoes' },
  //    { quantity: '1 (.7 ounce) package', name: 'dry italian-style salad dressing mix' },
  //    { quantity: '3/4 cup', name: 'extra virgin olive oil' },
  //    { quantity: '1/4 cup', name: 'balsamic vinegar' },
  //    { quantity: '2 tablespoons', name: 'dried oregano' },
  //    { quantity: '1 tablespoon', name: 'dried parsley' },
  //    { quantity: '1 tablespoon', name: 'grated parmesan cheese' },
  //    { quantity: '', name: 'salt and ground black pepper to taste' } ],
  // ingredient_names: 
  //  [ 'seashell pasta',
  //    'genoa salami',
  //    'pepperoni sausage',
  //    'asiago cheese',
  //    'black olives',
  //    'red bell pepper',
  //    'green bell pepper',
  //    'tomatoes',
  //    'dry italian-style salad dressing mix',
  //    'extra virgin olive oil',
  //    'balsamic vinegar',
  //    'dried oregano',
  //    'dried parsley',
  //    'grated parmesan cheese',
  //    'salt and ground black pepper to taste' ]
  // });
}());