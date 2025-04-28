const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Server-side code
exports.getISSData = functions.https.onRequest(async (req, res) => {
    try {
        // Get the IP address of the caller
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Reference to the rate-limiting document in Firestore
        const rateLimitDocRef = db.collection('rate-limits').doc(ipAddress);

        // Get the last request time for this IP
        const rateLimitDoc = await rateLimitDocRef.get();
        const now = Date.now();

        if (rateLimitDoc.exists) {
            const lastRequestTime = rateLimitDoc.data().lastRequestTime || 0;

            // Check if at least 1 second has passed since the last request
            if (now - lastRequestTime < 1000) {
                return res.status(429).send({ error: 'Too many requests. Please wait a second before trying again.' });
            }
        }

        // Update the last request time for this IP
        await rateLimitDocRef.set({ lastRequestTime: now }, { merge: true });

        // Fetch data from the ISS API
        const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        const data = await response.json();

        // Validate the API response
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
        res.status(500).send({ error: 'Failed to fetch ISS data :( ' });
    }
});


