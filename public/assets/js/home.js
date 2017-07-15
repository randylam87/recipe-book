let isLoggedIn = false;
let numOfRecipes = $('.recipes').length;
$('#numOfRecipes').html(numOfRecipes);
if ($('#nav-user').attr('user-id')) {
    isLoggedIn = true;
}
console.log(isLoggedIn);

$('.recipe-img-container').on('click', function () {
    let recipeId = $(this).attr('recipe-id');
    window.location.href = `/recipes/${recipeId}`;
});

$('#newRecipe').on('click', function () {
    if(isLoggedIn){
        window.location.href = `new`;
    } else if (!isLoggedIn) {
        $('#signinModal').modal({
            show: 'false'
        });
    }
});