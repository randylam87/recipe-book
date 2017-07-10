let nutrition = document.getElementById('nutrition').getContext('2d');
let nutritionChart = new Chart(nutrition, {
  type: 'doughnut',
  data: {
    labels: ['Fats', 'Carbohydrates', 'Protein'],
    datasets: [{
      label: "Macro Nutrients:",
      data: [30, 40, 100], //need real data here
      backgroundColor: ['#fdfd96', '#836953', '#FF6961'],
      hoverBorderColor: ['#fdfd96', '#836953', '#FF6961']
    }]
  },
  options: {
    title: {
      display: true,
      text: "Macro Nutrients: (this is just sample values)"
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          //get the concerned dataset
          let dataset = data.datasets[tooltipItem.datasetIndex];
          //calculate the total of this data set
          let total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
            return previousValue + currentValue;
          });
          //get the current items value
          let currentValue = dataset.data[tooltipItem.index];
          //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
          let precentage = Math.floor(((currentValue / total) * 100) + 0.5);
          return precentage + "%";
        }
      }
    }
  }
});