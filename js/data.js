console.log('data.js loaded');

// Fetch data from API
const apiUrl = 'https://surf.lucatimlauener.ch/php/unload.php';

// Global variables to store the fetched data
let firstdata = [];
let chart = null;

// Fetch and initialize the data
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        firstdata = data;
        updateChart(7); // Initialize with the last 7 days
    })
    .catch(error => console.error('Error fetching data:', error));

// Function to update the chart based on the number of days
function updateChart(days) {
    // Organize data by location
    const locations = ['Baden', 'Mellingen', 'Thun'];

    // Filter the data for the selected number of days
    const recentData = firstdata.slice(-days * 3); // 3 entries per day (Baden, Mellingen, Thun)
    const dateLabels = [...new Set(recentData.map(item => item.date.split(' ')[0]))]; // Unique dates

    const surfabilityByLocation = {
        Baden: [],
        Mellingen: [],
        Thun: []
    };

    recentData.forEach(item => {
        if (surfabilityByLocation[item.location]) {
            surfabilityByLocation[item.location].push(item.surfability_score);
        }
    });

    // Destroy the existing chart if it exists
    if (chart) {
        chart.destroy();
    }

    // Create a new chart
    const ctx = document.getElementById('myChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dateLabels,  // X-axis: Dates
            datasets: [
                {
                    label: 'Baden',
                    data: surfabilityByLocation.Baden,
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    fill: true
                },
                {
                    label: 'Mellingen',
                    data: surfabilityByLocation.Mellingen,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    fill: true
                },
                {
                    label: 'Thun',
                    data: surfabilityByLocation.Thun,
                    borderColor: 'green',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    fill: true
                }
            ]
        },
        options: {
            responsive: false,
            plugins: {
                title: {
                    display: true,
                    text: `Surfability Score over last ${days} Days`
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 10, // Surfability score range is likely between 0 and 10
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Surfability Score'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });
}

// Add event listener for the input field to change the number of days displayed
document.getElementById('days').addEventListener('input', (event) => {
    const days = event.target.value;
    updateChart(days);
});