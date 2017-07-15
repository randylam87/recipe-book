let nutrition = document.getElementById('nutrition').getContext('2d');
let nutritionArray = document.getElementById('nutritionDiv').getAttribute("data-nutrition");
let nutritionChart = new Chart(nutrition, {
  type: 'doughnut',
  data: {
    labels: ['Fats', 'Carbohydrates', 'Protein'],
    datasets: [{
      data: JSON.parse(nutritionArray),
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

let nutrition2 = document.getElementById('nutrition2').getContext('2d');
let nutritionArray2 = document.getElementById('nutritionDiv2').getAttribute("data-nutrition2");
let nutritionChart2 = new Chart(nutrition2, {
  type: 'pie',
  data: {
    labels: ['Calcium', 'Magnesium', 'Potassium', 'Iron', 'Zinc', 'Phosphorus', 'Vitamin C', 'Riboflavin', 'Vitamin B6', 'Vitamin B12'],
    datasets: [{
      data: JSON.parse(nutritionArray2),
      backgroundColor: ['#a1c3d3', '#9bf1e1', '#ffcdd3', '#f5e72c', '#8d1832', '#f572a1', '#7c4a32', '#ff4632', '#5ef550', '#c97c54'],
      hoverBorderColor: ['navy', 'teal', 'red', 'green', 'black', 'orange', 'yellow', 'pink', 'purple', 'grey']
    }]
  },
  options: {
    title: {
      display: true,
      text: "Vitamins and Minerals(In MG)"
    }
  }
});