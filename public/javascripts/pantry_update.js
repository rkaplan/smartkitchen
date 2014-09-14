/*global io*/
(function(){
  "use strict";

  var socket = io(),

  // functions
  removeItems, addItems;

  socket.on("pantry_update", function(msg){
    if (msg.removed){
      removeItems(msg.removed);
    }
    if (msg.added){
      addItems(msg.added);
    }
  });

  removeItems = function(items){
    for(var i = 0; i < items.length; i++){
      $("[data-id=" + items[i].id + "]").remove();
    }
  };

  addItems = function(items){
    var pantryItems = $(".pantryItems");
    var count = $(".pantryItem").length;
    for (var i = 0; i < items.length; i++){
      var item = items[i];
      var node = $(document.createElement("div"));
      node.addClass("pantryItem");
      node.addClass("col-sm-3");
      node.addClass("col-sm-offset1");
      node.attr("data-id", item.barcode);

      var image = $(document.createElement("img"));
      image.attr("src", item.image);
      image.attr("width", 100 + "px");
      node.append(image);

      var name = $(document.createElement("p"));
      name.text(item.name);
      node.append(name);

      count++;
      if (count % 3 === 0){
        var row = $(document.createElement("row"));
        row.addClass("row");
        row.append(node);
        pantryItems.append(row);
      } else {
        $(".pantryItems .row").last().append(node);
      }
    }
  };
}());
