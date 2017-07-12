let numOfRecipes = $('.recipes').length;

console.log(numOfRecipes);
// $('#numOfRecipes').html(numOfRecipes);

// let paginate = (limit) =>{
//     let numOfButtons = Math.ceil(numOfRecipes/limit);
//     return numOfButtons;
// };

// console.log(paginate(10));

$.get('/',(data) => {
    $('#numOfRecipes').html(numOfRecipes);
});