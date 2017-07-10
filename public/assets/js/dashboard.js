$(document).ready(function(){
    $("#create-cookbook-button").on("click", function(){
        var title = $("#cookbook-title-field").val();
        $("#create-book-display").after("<div class='col-sm-2'><a href='#'><span class='glyphicon glyphicon-book' id='my-book'></span><p>"+ title +"</p></a></div>")
    })
})