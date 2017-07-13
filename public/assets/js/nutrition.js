let nutrition = document.getElementById('nutrition').getContext('2d');
let nutritionArray = document.getElementById('nutritionDiv').getAttribute("data-nutrition");
console.log(nutritionArray);
let nutritionChart = new Chart(nutrition, {
  type: 'doughnut',
  data: {
    labels: ['Fats', 'Carbohydrates', 'Protein'],
    datasets: [{
      data: JSON.parse(nutritionArray), //need real data here
      // data: [30, 40, 100], //need real data here
      backgroundColor: ['#a1c3d3', '#9bf1e1', '#ffcdd3'],
      hoverBorderColor: ['navy', 'teal', 'red']
    }]
  },
  options: {
    title: {
      display: true,
      text: "Macro Nutrients(In Grams)"
    }
  }
});