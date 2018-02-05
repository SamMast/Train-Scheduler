 // Initialize Firebase
var config = {
    apiKey: "AIzaSyDmMz2q-vlre_qH1AZAPwBBBCIaZFG0OhU",
    authDomain: "train-scheduler-458fb.firebaseapp.com",
    databaseURL: "https://train-scheduler-458fb.firebaseio.com",
    projectId: "train-scheduler-458fb",
    storageBucket: "",
    messagingSenderId: "687754689155"
  };

firebase.initializeApp(config);

var database = firebase.database();

//-------------------------------------------

var trainName = "";
var destination = "";
var startTime = "";
var nextTime = "";
var frequency = 0;
var minutesAway = 0;


//on click of submit button
$("#submitButton").on("click", function() {
  event.preventDefault();

  trainName = $("#nameInput").val().trim();
  console.log(trainName);

  destination = $("#destinationInput").val().trim();
  console.log(destination);

  startTime = moment($("#startInput").val().trim(), "hh:mm").subtract(1, "years")
  startTimeFormatted = startTime._i;
  console.log(startTime);


  frequency = $("#frequencyInput").val().trim();
  console.log(frequency);

  database.ref().push({
    name: trainName,
    destination: destination,
    startTime: startTimeFormatted,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

  $("input").val("");

});


$("table").on("click", "#deleteButton", function() {

  //set var to the confirm question boolean
  var x = confirm("Are you sure you want to delete this Train Schedule?");

  //if delete confirmed
  if (x) {

    //set the id equal to the data-id we set
    var id = $(this).attr("data-id")

    //in the databaselook for the child with the same id, and remove from database
    database.ref().child(id).remove();

    //look for the clicked items tr parent (table row), and remove it
    //parents looks multiple levels, parent() looks 1 level
    $(this).parents("tr").remove();

  //else, if delete is not confirmed
  } else {
    console.log("employee NOT deleted")
  }
});


database.ref().on("child_added", function(snapshot) {

    // Log everything that's coming out of snapshot
    // console.log(snapshot.val());
    var firstTrainTime = snapshot.val().startTime;
    var frequency = snapshot.val().frequency;

    var startTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
    // console.log(startTimeConverted);

    // Current Time
    var currentTime = moment();
    // console.log(currentTime);

    // Difference between the times
    var diffTime = moment().diff(moment(startTimeConverted), "minutes");

    console.log("DIFFERENCE IN TIME: " + diffTime);


    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    // console.log(tRemainder);

    // Minute Until Train
    var minutesAway = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);

    // Next Train
    var nextTime = moment().add(minutesAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTime).format("hh:mm"));

      // Change the HTML to reflect

      $("#newTrain").append("<tr class='table-data'><td id='name'>" + snapshot.val().name + "</td><td id='destination'>" + snapshot.val().destination + "</td><td id='frequency'>" + snapshot.val().frequency + "</td><td id='nextTime'>" + moment(nextTime).format("llll") + "</td><td id='minutesAway'>" + minutesAway + "</td><td><button class='btn btn-danger col-md-4 col-md-offset-2 col-xs-4 col-xs-offset-2 col-sm-4 col-sm-offset-2 col-lg-4 col-lg-offset-2' id='deleteButton' data-id=" + snapshot.key + "><span class='glyphicon glyphicon-minus'></span></button></td></tr>"
        );

    // Handle the errors

    }, function(errorObject) {

      console.log("Errors handled: " + errorObject.code);

    });

var refreshPage = function() {
  $("#newTrain").empty();
  database.ref().on('value', function(snap) {
      snap.forEach(function(snapshot) {
      var firstTrainTime = snapshot.val().startTime;
      var frequency = snapshot.val().frequency;

      var startTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");

      // Current Time
      var currentTime = moment();

      // Difference between the times
      var diffTime = moment().diff(moment(startTimeConverted), "minutes");

      // Time apart (remainder)
      var tRemainder = diffTime % frequency;

      // Minute Until Train
      var minutesAway = frequency - tRemainder;

      // Next Train
      var nextTime = moment().add(minutesAway, "minutes");

      // Change the HTML to reflect
      $("#newTrain").append("<tr class='table-data'><td id='name'>" + snapshot.val().name + "</td><td id='destination'>" + snapshot.val().destination + "</td><td id='frequency'>" + snapshot.val().frequency + "</td><td id='nextTime'>" + moment(nextTime).format("llll") + "</td><td id='minutesAway'>" + minutesAway + "</td><td><button class='btn btn-danger col-md-4 col-md-offset-2 col-xs-4 col-xs-offset-2 col-sm-4 col-sm-offset-2 col-lg-4 col-lg-offset-2' id='deleteButton' data-id=" + snapshot.key + "><span class='glyphicon glyphicon-minus'></span></button></td></tr>"
        );
    });
  });
  setTimeout(function(){refreshPage();}, 1000 * 60);
}

setTimeout(function(){refreshPage();}, 1000 * 60);