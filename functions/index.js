const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Server-side code
exports.getISSData = functions.https.onRequest(async (req, res) => {
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

        // Send the data back to the client
        res.status(200).send(data);
    } catch (error) {
        console.error('Sad times, error fetching ISS data:', error);
        res.status(500).send({ error: 'Failed to fetch ISS data :(' });
    }
});


