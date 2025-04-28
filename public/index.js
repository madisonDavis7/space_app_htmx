//client side code that intercts with DOM and firebase functions
async function fetchISSData() {
    const issButton = document.getElementById('iss-btn'); // Get the button element

    try {
        // Disable the button, to limit clicks/calls to api
        issButton.disabled = true;

        // Fetch data from the Firebase Function
        const response = await fetch('https://us-central1-fnof-stack-a31a1.cloudfunctions.net/getISSData');
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch ISS data how tragic');
        }
        const data = await response.json();

        // Update the latitude and longitude elements
        document.getElementById('latitude').textContent = data.latitude.toFixed(2);
        document.getElementById('longitude').textContent = data.longitude.toFixed(2);
    } catch (error) {
        console.error('Error fetching ISS dataaa:', error.message);
        alert(error.message);
    } finally {
        // Re-enable the button after 2 seconds
        setTimeout(() => {
            issButton.disabled = false;
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const issButton = document.getElementById('iss-btn');
    if (issButton) {
        issButton.addEventListener('click', fetchISSData);
    }
});