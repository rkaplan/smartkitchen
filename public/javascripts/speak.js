$(function() {

  function kv (k, v) {
    if (toString.call(v) !== "[object String]") {
      v = JSON.stringify(v);
    }
    return k + "=" + v + "\n";
  }

  var mic = new Wit.Microphone(document.getElementById("microphone"));
  var isRecording = false;

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
    }
  }

  function handleGetRecipesSuccess(data){
    console.log("Got recipe data", data);
  }

  function errorHandler(err){
    console.error(err);
    alert("Unable to connect. Please try again");
  }

  $('#record').click(function() {
    if (!isRecording)
      startRecording();
    else
      stopRecording();
  })

});
