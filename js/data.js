console.log('data.js loaded');

// Fetch data from API
const apiUrl = 'https://surf.lucatimlauener.ch/php/unload.php';

// Global variables to store the fetched data
let firstdata = [];
let chart = null;

// Fetch and initialize the data
fetch(`${apiUrl}?Interval=7`)  // Default to 7 days on initial load
    .then(response => response.json())
    .then(data => {
        console.log(data);
        firstdata = data;
        updateChart(7);  // Initialize with the last 7 days
    })
    .catch(error => console.error('Error fetching data:', error));

// Function to update the chart based on the number of days
function updateChart(days) {
    const apiUrlWithInterval = `${apiUrl}?Interval=${days}`;  // Add interval to API URL
    
    // Fetch the data for the selected number of days
    fetch(apiUrlWithInterval)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            firstdata = data;

            // Organize data by location
            const locations = ['Baden', 'Mellingen', 'Thun'];

            // Filter the data for the selected number of days
            const recentData = firstdata.slice(-days * 3);  // 3 entries per day (Baden, Mellingen, Thun)
            const dateLabels = [...new Set(recentData.map(item => item.date.split(' ')[0]))];  // Unique dates

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

            // Create gradient colors for the chart lines
            let gradientBaden = ctx.createLinearGradient(0, 0, 0, 400);
            gradientBaden.addColorStop(0, 'rgba(255, 239, 158, 1)');
            gradientBaden.addColorStop(1, 'rgba(255, 239, 158, 0.4)');

            let gradientMellingen = ctx.createLinearGradient(0, 0, 0, 400);
            gradientMellingen.addColorStop(0, 'rgba(21, 116, 154, 1)');
            gradientMellingen.addColorStop(1, 'rgba(21, 116, 154, 0.4)');

            let gradientThun = ctx.createLinearGradient(0, 0, 0, 400);
            gradientThun.addColorStop(0, 'rgba(75, 192, 192, 1)');
            gradientThun.addColorStop(1, 'rgba(75, 192, 192, 0.4)');

            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dateLabels,  // X-axis: Dates
                    datasets: [
                        {
                            label: 'Baden',
                            data: surfabilityByLocation.Baden,
                            borderColor: 'rgba(88, 255, 136, 0)',
                            backgroundColor: gradientBaden,
                            fill: true
                        },
                        {
                            label: 'Mellingen',
                            data: surfabilityByLocation.Mellingen,
                            borderColor: 'rgba(21, 116, 154, 0)',
                            backgroundColor: gradientMellingen,
                            fill: true
                        },
                        {
                            label: 'Thun',
                            data: surfabilityByLocation.Thun,
                            borderColor: 'rgba(255, 239, 158, 0)',
                            backgroundColor: gradientThun,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            labels: {
                                color: 'white',  // Set the color of the labels to white
                            }
                        },
                        title: {
                            display: true,
                            text: `Surfability Score in den letzten ${days} Tagen`,
                            color: 'white',
                            font: {
                                family: '"Lilita One", sans-serif',  // Set the font for the title
                            }
                        }
                    },
                    scales: {
                        y: {
                            min: 0,
                            max: 10,  // Surfability score range between 0 and 10
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Surfability Score',
                                color: 'white'
                            },
                            ticks: {
                                color: 'white'  // Y-axis numbers color
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.3)',  // Grid line color
                                borderColor: 'white'  // Border color of the Y-axis
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Date',
                                color: 'white'
                            },
                            ticks: {
                                color: 'white'  // X-axis numbers color
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.3)',  // Grid line color
                                borderColor: 'white'  // Border color of the X-axis
                            }
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Add event listener for the input field to change the number of days displayed
document.getElementById('days').addEventListener('input', (event) => {
    const days = event.target.value;
    updateChart(days);
});
