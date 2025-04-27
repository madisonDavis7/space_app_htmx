async function fetchISSData() {
    try {
        // Fetch data from the API
        const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        const data = await response.json();

        // Update the latitude and longitude elements
        document.getElementById('latitude').textContent = data.latitude.toFixed(2);
        document.getElementById('longitude').textContent = data.longitude.toFixed(2);
    } catch (error) {
        console.error('Error fetching ISS data:', error);
    }
}

//add listeners so when button clicked its updated
document.addEventListener('DOMContentLoaded', () => {
    const issButton = document.getElementById('iss-button');
    if (issButton) {
        issButton.addEventListener('click', fetchISSData);
    }
});


