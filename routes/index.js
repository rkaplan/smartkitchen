(function(){
  "use strict";

  var Routes = {
    Inventory: require("./Inventory.js")
  };

  var routeList = [
    ["/inventory",      Routes.Inventory, 1, 0, [      "post", "put"]]
  ];

  module.exports = routeList;
}());
