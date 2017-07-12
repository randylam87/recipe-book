$.get('/', (data) => {
    let numOfRecipes = $('.recipes').length;
    let paginate = (limit) => {
        let numOfButtons = Math.ceil(numOfRecipes / limit);
        return numOfButtons;
    };
    paginate(10);

    $('#numOfRecipes').html(numOfRecipes);

    for(let i =1; i<numOfButtons+1;i++){
        let paginationButton = $(`<div class='pagination-page-${{num}} pagination-button'`);
        paginationButton.text(num);
    }
    console.log(numOfButtons);
    console.log(numOfRecipes)
    $('#pagination').append(paginationButton);
});