
var config = {
    apiKey: "AIzaSyBcYCHp3iRwP2_yMoYBPsu7o1TvIv0X9KI",
    authDomain: "pnil-world.firebaseapp.com",
    databaseURL: "https://pnil-world.firebaseio.com",
    projectId: "pnil-world",
    storageBucket: "pnil-world.appspot.com",
    messagingSenderId: "464639531572"
};

firebase.initializeApp(config);

var database = firebase.database();

$("#sendMessage").on("click", function(event){
    event.preventDefault();

    var message = $("#typeMessage").val().trim();
    var timeStamp = Date();

    database.ref().set({
      message: message,
      timeStamp: timeStamp
    });

    $("#typeMessage").val("");
   
});

$(".container").keyup(function (event) {
    if (event.keyCode === 13) {
        $("#sendMessage").click();
    }
});

database.ref().on("value", function(snapshot){
    message = snapshot.val().message;
    timeStamp = Date();
    $("#chatBox").append("(" + timeStamp + "): " + message + "<br>");
});