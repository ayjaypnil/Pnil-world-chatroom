
var config = {
    apiKey: "AIzaSyBcYCHp3iRwP2_yMoYBPsu7o1TvIv0X9KI",
    authDomain: "pnil-world.firebaseapp.com",
    databaseURL: "https://pnil-world.firebaseio.com",
    projectId: "pnil-world",
    storageBucket: "pnil-world.appspot.com",
    messagingSenderId: "464639531572"
};

firebase.initializeApp(config);


const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');
const stuff = document.getElementById("stuff");
const space = document.getElementById("space");
const popDiv2 = document.getElementById("populationDiv2");

$("#btnLogin").on("click", function(){
    firebase.auth().signInAnonymously();
});
$("#btnLogout").on("click", function() {
  firebase.auth().signOut();
});



var userID;

firebase.auth().onAuthStateChanged(firebaseUser => {
 console.log(firebaseUser);
    if(firebaseUser){
        btnLogout.classList.remove('hide');
        btnLogin.classList.add('hide');
        stuff.classList.remove("hide");
        userID = firebaseUser.uid;
        $("#userID").html("<span><strong>" + userID + "</strong></span>");
        space.classList.add("hide");
        popDiv2.classList.add("hide");
    } else{
        btnLogout.classList.add('hide');
        btnLogin.classList.remove('hide');
        stuff.classList.add("hide");
        space.classList.remove("hide");
        popDiv2.classList.remove("hide");
    }
});


var database = firebase.database();


// button animation
$("#typeMessage").on("click", function(event){
    $("#sendMessage").attr("class", "pulse waves-effect waves-light btn");
});

$("#sendMessage").on("click", function(event){
    event.preventDefault();

    var message = $("#typeMessage").val().trim();
    var today = new Date();
    var options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    var timeStamp = today.toLocaleDateString('en-US', options);
   
    $("#sendMessage").attr("class", "waves-effect waves-light btn");
    
   
// writing to the database
    database.ref("/messages").push({
        message: message,
        timeStamp: timeStamp,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
    
    // for the message input to clear after submit
    $("#typeMessage").val("");
    // for the scroll box to stay at the bottom
    $("#chatBox").scrollTop($("#chatBox")[0].scrollHeight - $("#chatBox")[0].clientHeight);
   
});
    // just another way to register the send, "enter" button
$(".container").keyup(function (event) {
    if (event.keyCode === 13) {
        $("#sendMessage").click();
    }
});

// grabbing from database

database.ref("/messages").orderByChild("dateAdded").limitToLast(15).on("child_added", function(snapshot){
    message = snapshot.val().message;
    timeStamp = snapshot.val().timeStamp;
   
    // $("#chatBox").append("<div id='messageFull'><strong>" + timeStamp + ": </strong><span id='messageText'>" + message + "</span></div>");
    $("#chatBox").append("<div id='mediaBox' class='col s12 m8'><div id='cardDiv' class='card-panel grey lighten-5 z-depth-1'><div class='row valign-wrapper'><div class='col s10' id='messageDivDiv'><span id='messageText' class=''>" + message + "</span></div></div><p id='timestampText' class='right-align'>" + timeStamp + "</p></div></div>");
    
   

});

// Live connected feature
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");

connectedRef.on("value", function(snap) {
  if (snap.val()) {
    var con = connectionsRef.push(true);
    con.onDisconnect().remove();
  }
});

connectionsRef.on("value", function(snap) {
  $("#connectedNum").text(snap.numChildren());
  $("#connectedNum2").text(snap.numChildren());

});