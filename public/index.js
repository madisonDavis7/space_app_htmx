//client side code that intercts with DOM and firebase functions
async function fetchISSData() {
    try {
        // Fetch data from the Firebase Function
        const response = await fetch('http://127.0.0.1:5001/fnof-stack-a31a1/us-central1/getISSData'); // Adjust the path based on your Firebase setup
        const data = await response.json();

        // Update the latitude and longitude elements
        document.getElementById('latitude').textContent = data.latitude.toFixed(2);
        document.getElementById('longitude').textContent = data.longitude.toFixed(2);
    } catch (error) {
        console.error('Error fetching ISS data:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const issButton = document.getElementById('iss-btn');
    if (issButton) {
        issButton.addEventListener('click', fetchISSData);
    }
});