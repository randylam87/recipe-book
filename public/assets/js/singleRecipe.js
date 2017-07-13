$(document).ready(function () {
    $.get("/json/" + $(".recipeName").data("recipeid"), function (data) {
        console.log(data);
        if(data.currentUser && data.currentUser.id == data.User.id){
            console.log("match");
        }
    });
});