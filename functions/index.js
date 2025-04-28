const functions = require('firebase-functions');
const fetch = require('node-fetch'); // Install this package using `npm install node-fetch`

exports.getISSData = functions.https.onRequest(async (req, res) => {
    try {
        const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        const data = await response.json();
        res.status(200).send(data);
    } catch (error) {
        console.error('Error fetching ISS data:', error);
        res.status(500).send({ error: 'Failed to fetch ISS data' });
    }
});


