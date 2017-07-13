$.get('/', (data) => {
    let numOfButtons;
    let numOfRecipes = $('.recipes').length;
    let paginate = (limit) => {
        numOfButtons = Math.ceil(numOfRecipes / limit);
        return numOfButtons;
    };
    //defines how many searches will be displayed
    paginate(10);

    $('#numOfRecipes').html(numOfRecipes);
    let paginationButton;
    for(let i =1; i<numOfButtons+1;i++){
        paginationButton = $(`<button class='btn btn-sm btn-primary page-${i} pagination-button'>`);
        paginationButton.text(i);
        $('#pagination').append(paginationButton);
    }
});

$('.recipes').on('click',function() {
    let recipeId = $(this).attr('recipe-id');
    window.location.href=`/recipes/${recipeId}`;
});