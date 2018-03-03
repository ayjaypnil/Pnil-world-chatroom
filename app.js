$("#sendMessage").on("click", function(event){
    event.preventDefault();

    var message = $("#typeMessage").val();
    $("#chatBox").append(message + "<br>");
    
    $("#typeMessage").val("");
   
});

$(".container").keyup(function (event) {
    if (event.keyCode === 13) {
        $("#sendMessage").click();
    }
});