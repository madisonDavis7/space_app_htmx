const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const cors = require("cors")({
    origin: 'https://fnof-stack-a31a1.web.app', // Update to match your frontend's URL
    allowedHeaders: [
        'Content-Type',
        'HX-Current-Url',
        'HX-Boosted',
        'HX-History-Restore-Request',
        'HX-Trigger',
        'HX-Request',
        'HX-Target',
        'HX-Trigger-Name',
        'HX-Prompt'
    ]
});

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Server-side code
exports.getISSData = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            // Fetch data from the ISS API
            const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
            const data = await response.json();

            // Log the data for debugging
            console.log('ISS Data:', data);

            if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
                throw new Error('Invalid data from ISS API');
            }

            // Save the data to Firestore
            const docRef = db.collection('iss-data').doc();
            await docRef.set({
                latitude: data.latitude,
                longitude: data.longitude,
            });

            //respond with an html
            //2 decimal places for latitude and longitude
            const htmlResponse = `
            <div>
                <h2>Current ISS Location</h2>
                <p id="latitude">Latitude: ${data.latitude.toFixed(3)}</p>
                <p id="longitude">Longitude: ${data.longitude.toFixed(2)}</p>
            </div>
            `;

            // Send the data back to the client as html
            res.status(200).send(htmlResponse);
        } catch (error) {
            console.error('Sad times, error fetching ISS data:', error);
            res.status(500).send('<p>Failed to fetch ISS data :(</p>');
        }
    });
});


