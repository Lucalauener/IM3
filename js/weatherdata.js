document.addEventListener("DOMContentLoaded", function() {
    // Set today's date in the input field as default
    let today = new Date().toISOString().split('T')[0];
    let dateInput = document.getElementById('surf-date');
    dateInput.value = today;

    // Function to fetch and display weather data
    function fetchWeatherData(date, location) {
        fetch('https://surf.lucatimlauener.ch/php/unloadweather.php?date=' + date)
        .then(response => response.json())
        .then(data => {
            // Find the weather data for the given location
            let weatherData = data.find(item => item.location === location);
            if (weatherData) {
                // Update the placeholders with actual weather data
                document.querySelector('.regenchance p').textContent = weatherData.rain + " mm";  // For rain
                document.querySelector('.wind p').textContent = weatherData.wind_speed + " km/h";  // For wind speed
                document.querySelector('.temperaturluft p').textContent = weatherData.temperature_celsius + " °C";
                document.querySelector('.temperatur p').textContent = weatherData.temperature_celsius + " °C";  
                
                
                let imgElement = document.querySelector('.img-container img');
                switch (weatherData.kondition.toLowerCase()) {
                    case 'sonnig':
                        imgElement.src = "img/sonnig.png";
                        break;
                    case 'regnerisch':
                        imgElement.src = "img/regnerisch.png";
                        break;
                    case 'bewölkt':
                        imgElement.src = "img/bewölkt.png";
                        break;
                    case 'teilweise bewölkt':
                        imgElement.src = "img/teilweise_bewölkt.png";
                        break;
                    default:
                        imgElement.src = "img/baden.jpg";  // Fallback to default image if no match
                        break;
                }
                imgElement.alt = weatherData.kondition;

            } else {
                console.log('No data available for the selected location');
            }
        })
        .catch(error => console.error('Error fetching weather data:', error));
    }

    // Get the location from the h1 element
    let location = document.querySelector('h1').textContent.trim();

    // Fetch data on page load
    fetchWeatherData(today, location);

    // Add event listener to update data when the date changes
    dateInput.addEventListener('change', function() {
        let selectedDate = this.value;
        fetchWeatherData(selectedDate, location);
    });
});
