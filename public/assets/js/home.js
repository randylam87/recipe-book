let isLoggedIn = false;
let numOfRecipes = $('.recipes').length;
let goToNewRecipe = false;
$('#numOfRecipes').html(numOfRecipes);
if ($('#nav-user').attr('user-id')) {
    isLoggedIn = true;
}

$('.recipe-img-container').on('click', function () {
    let recipeId = $(this).attr('recipe-id');
    window.location.href = `/recipes/${recipeId}`;
});

$('#newRecipe').on('click', function () {
    if(isLoggedIn){
        window.location.href = `new`;
    } else if (!isLoggedIn) {
        goToNewRecipe = true;
        $('#signinModal').modal({
            show: 'false'
        });
    }
});