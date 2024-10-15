document.addEventListener("DOMContentLoaded", function() {
    // Set today's date in the input field as default
    let today = new Date().toISOString().split('T')[0];
    let dateInput = document.getElementById('surf-date');
    dateInput.value = today;

    // Example thresholds for Abfluss (water flow) and corresponding images
    const thresholds = [
        { maxFlow: 50, img: 'img/waterlevel/1.png' },
        { maxFlow: 100, img: 'img/waterlevel/2.png' },
        { maxFlow: 150, img: 'img/waterlevel/3.png' },
        { maxFlow: 200, img: 'img/waterlevel/4.png' },
        { maxFlow: 250, img: 'img/waterlevel/5.png' },
        { maxFlow: 300, img: 'img/waterlevel/6.png' },
        { maxFlow: Infinity, img: 'img/waterlevel/7.png' }
    ];

    // Function to fetch and display Abfluss data
    function fetchAbflussData(date, location) {
        fetch('https://surf.lucatimlauener.ch/php/unloadabfluss.php?date=' + date)
        .then(response => response.json())
        .then(data => {
            // Find the data for the given location
            let abflussdata = data.find(item => item.location === location);
            if (abflussdata) {
                // Call function to update the wave image based on river discharge
                updateWaveImage(abflussdata.river_discharge);
            } else {
                console.log('No data available for the selected location');
            }
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    // Function to determine and update the wave image based on water flow
    function updateWaveImage(flow) {
        let selectedImage = 'img/waterlevel/1.png'; // Default image

        for (let i = 0; i < thresholds.length; i++) {
            if (flow <= thresholds[i].maxFlow) {
                selectedImage = thresholds[i].img;
                break;
            }
        }

        // Update the image in the waves placeholder
        const waveImage = document.querySelector('.waves img');
        waveImage.src = selectedImage;  // Set the new source for the wave image
        waveImage.alt = "Water level based on flow of " + flow + " m³/s";
    }

    // Get the location from the h1 element
    let location = document.querySelector('h1').textContent.trim();

    // Fetch data on page load
    fetchAbflussData(today, location);

    // Add event listener to update data when the date changes
    dateInput.addEventListener('change', function() {
        let selectedDate = this.value;
        fetchAbflussData(selectedDate, location);
    });
});
