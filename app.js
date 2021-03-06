// Firebase configeration
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

$(document).ready(function() {
   // for the scroll box to stay at the bottom
    $("#chatBox").scrollTop($("#chatBox")[0].scrollHeight - $("#chatBox")[0].clientHeight);
});



//anonymous authentication
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
 
    if(firebaseUser){
        btnLogout.classList.remove('hide');
        btnLogin.classList.add('hide');
        stuff.classList.remove("hide");
        userID = firebaseUser.uid;
        $("#userID").html("<span><strong>" + userID + "</strong></span>");
        space.classList.add("hide");
        popDiv2.classList.add("hide");

        // for the scroll box to stay at the bottom
        $("#chatBox").scrollTop($("#chatBox")[0].scrollHeight - $("#chatBox")[0].clientHeight);
    } else{
        btnLogout.classList.add('hide');
        btnLogin.classList.remove('hide');
        stuff.classList.add("hide");
        space.classList.remove("hide");
        popDiv2.classList.remove("hide");
    }
});


// PICTURES!

// get elements

var fileButton = document.getElementById('fileButton');

// set up references
var storage = firebase.storage();
var storageRef = storage.ref();
var a;
var file;
var pathReference;
var url;
var time;
var timeStamp;

    fileButton.addEventListener("change", function(e){
            // get file
            file = e.target.files[0];
            // create a storage ref
            a = storageRef.child('media/' + file.name);
            console.log(a);
            
           
            // upload file
            a.put(file).then(function(result){
            console.log(result);
                // download the file
                a.getDownloadURL().then(function(url) {
                // `url` is the download URL 
                    console.log(url);
                    time = Math.round(new Date().getTime() / 1000);
                    // save the download url to the database
                    database.ref("/messages").push({
                        url: url,
                        time: time,
                        userID: userID,
                        dateAdded: firebase.database.ServerValue.TIMESTAMP
                });
            });       
        }).catch(function(error) {
            if (error) throw error;
        });
    });






// button animation
$("#typeMessage").on("click", function(event){
    $("#sendMessage").attr("class", "pulse waves-effect waves-light btn");
});


$("#sendMessage").on("click", function(event){
    
    event.preventDefault();

    var message = $("#typeMessage").val().trim();
    
    timeStamp = Math.round(new Date().getTime() / 1000);
   
    $("#sendMessage").attr("class", "waves-effect waves-light btn");
    
   
// writing to the database
    database.ref("/messages").push({
        message: message,
        timeStamp: timeStamp,
        userID: userID,
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

// grabbing from database (both pictures and text)

database.ref("/messages").orderByChild("dateAdded").limitToLast(15).on("child_added", function(snapshot){
    message = snapshot.val().message;
    timeStamp = snapshot.val().timeStamp;
    url = snapshot.val().url;
    time = snapshot.val().time;
    
    if(message){
        $("#chatBox").append("<div id='mediaBox' class='col s12 m8'><div id='cardDiv' class='card-panel grey lighten-5 z-depth-1'><div class='row valign-wrapper'><div class='col s10' id='messageDivDiv'><span id='messageText' class=''>" + message + "</span></div></div><p id='timestampText' class='right-align'>" + "About: " + timeSince(timeStamp) + " ago" + "</p></div></div>");
    } else {
        $("#chatBox").append("<div id='mediaBox' class='col s12 m8'><div id='cardDiv' class='card-panel grey lighten-5 z-depth-1'><div class='row valign-wrapper'><div class='col s10' id='messageDivDiv'><span><center><img src='" + url + "'></center></span></div></div><p id='timestampTextM' class='right-align'>" + "About: " + timeSince(time) + " ago" + "</p></div></div>");
    }
    // for the scroll box to stay at the bottom
    $("#chatBox").scrollTop($("#chatBox")[0].scrollHeight - $("#chatBox")[0].clientHeight);
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



// For the timestamps to display as they do
function timeSince(date) {
  var seconds = Math.floor(new Date().getTime() / 1000 - date),
    interval = Math.floor(seconds / 31536000);

  if (interval > 1) return interval + "y";

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + "m";

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + "d";

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + "h";

  interval = Math.floor(seconds / 60);
  if (interval > 1) return interval + "m ";

  return Math.floor(seconds) + "s";
}


// SIDEBAR
$(document).ready(function(){
  $('.button-collapse').sideNav({
      menuWidth: 275, // Default is 300
      edge: 'left', // Choose the horizontal origin
      closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true // Choose whether you can drag to open on touch screens
    }
  );
    $(".parallax").parallax();
});
 
 // START OPEN
$('.button-collapse').sideNav('show');