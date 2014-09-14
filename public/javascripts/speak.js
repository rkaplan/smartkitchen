/*globals Wit, toString*/
$(function() {
  "use strict";

  function kv (k, v) {
    if (toString.call(v) !== "[object String]") {
      v = JSON.stringify(v);
    }
    return k + "=" + v + "\n";
  }

  var mic = new Wit.Microphone(document.getElementById("microphone"));
  var isRecording = false;

  var yesCallback = null;

  var info = function (msg) {
    document.getElementById("info").innerHTML = msg;
  };

  mic.onready = function () {
    info("Microphone is ready to record");
  };

  mic.onaudiostart = function () {
    info("Recording started");
  };

  mic.onaudioend = function () {
    info("Recording stopped, processing started");
  };

  mic.onerror = function (err) {
    info("Error: " + err);
  };

  mic.onresult = function (intent, entities) {
    processResults(intent, entities);
    var r = kv("intent", intent);
    for (var k in entities) {
      var e = entities[k];
      if (!(e instanceof Array)) {
        r += kv(k, e.value);
      } else {
        for (var i = 0; i < e.length; i++) {
          r += kv(k, e[i].value);
        }
      }
    }
    document.getElementById("result").innerHTML = r;
  };

  mic.connect("ERMHYREEK3UBEUZRAFPNYI2D23T3OUZO");

  function startRecording() {
    isRecording = true;
    mic.start();
    $('.wit-microphone').addClass('active');
  }

  function stopRecording() {
    isRecording = false;
    mic.stop();
    $('.wit-microphone').removeClass('active');
  }

  function processResults(intent, entities) {
    if (intent === 'request_recipe') {
      $.ajax({
        type: "GET",
        url: "/recipes",
        success: handleGetRecipesSuccess,
        error: errorHandler
      });
    } else if (intent === 'Find_object') {
      // TODO: FIND AN OBJECT
    } else if (intent === "affirmative") {
      if (yesCallback){
        yesCallback();
      }
    } else {
      say("Sorry, what did you say?");
    }
  }

  function handleGetRecipesSuccess(data){
    console.log("Got recipe data", data);
    var title = data.recipe.recipe.title;
    if (data.recipe.num_ingredients_needed === 0){
      say("You have everything you need to make " + title);
    } else {
      var ingredient = data.recipe.ingredients_needed[0];
      say("In order to make " + title + " you need " + ingredient + "." + " Would you like me to order it for you?");
      waitForYes(function(){
        $.ajax({
          type: "POST",
          url: "/order_item",
          data: JSON.stringify({
            name: ingredient
          }),
          dataType: "json",
          success: function(){
            say("OK. " + ingredient + " should be here soon");
          },
          failure: errorHandler
        });
      });
    }
  }

  function say(msg){
    // TODO: Implement say
    $.ajax({
      url: "/say",
      type: "POST",
      data: JSON.stringify({
        msg: msg
      }),
      dataType: "json"
    });
    console.log("Saying " + msg);
  }

  function waitForYes(cb){
    yesCallback = cb;
  }

  function errorHandler(err){
    console.error(err);
    alert("Unable to connect. Please try again");
  }

  $('#record').click(function() {
    if (!isRecording){
      startRecording();
    } else {
      stopRecording();
    }
  });

});
