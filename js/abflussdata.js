document.addEventListener("DOMContentLoaded", function() {
    // Set today's date in the input field as default
    let today = new Date().toISOString().split('T')[0];
    let dateInput = document.getElementById('surf-date');
    dateInput.value = today;

    // Function to fetch and display weather data
    function fetchAbflussData(date, location) {
        fetch('https://surf.lucatimlauener.ch/php/unloadabfluss.php?date=' + date)
        .then(response => response.json())
        .then(data => {
            // Find the weather data for the given location
            let abflussdata = data.find(item => item.location === location);
            if (abflussdata) {
                // Update the placeholders with actual weather data
                document.querySelector('.abfluss p').textContent = abflussdata.river_discharge + " m³";  
                document.querySelector('.surfability p').textContent = abflussdata.surfability_score;
            } else {
                console.log('No data available for the selected location');
            }
        })
        .catch(error => console.error('Error fetching weather data:', error));
    }

    // Get the location from the h1 element
    let location = document.querySelector('h1').textContent.trim();

    // Fetch data on page load
    fetchAbflussData(today, location);  // Korrigierter Funktionsaufruf

    // Add event listener to update data when the date changes
    dateInput.addEventListener('change', function() {
        let selectedDate = this.value;
        fetchAbflussData(selectedDate, location);  // Korrigierter Funktionsaufruf
    });
});