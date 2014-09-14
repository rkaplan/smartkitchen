(function(){
  "use strict";

  var Routes = {
    Inventory: require("./Inventory.js"),
    Pantry: require("./Pantry.js"),
    Speak: require("./Speak.js"),
    Recipes: require("./Recipes.js")  ,
    OrderItem: require("./OrderItem.js"),
    Say: require("./Say.js")
  };

  var routeList = [
    ["/inventory",      Routes.Inventory, 1, 0, 1,  [      "post", "put"]],
    ["/pantry",         Routes.Pantry,    1, 0, 0,  ["get"              ]],
    ["/speak",  Routes.Speak, 1, 0,  ["get" ]],
    ["/recipes",  Routes.Recipes, 1, 0, 0,  ["get" ]]  ,
    ["/order_item",  Routes.OrderItem, 1, 0, 1,  ["post" ]],
    ["/say",         Routes.Say,       1, 0, 1, ["post"]]
  ];

  module.exports = routeList;
}());
