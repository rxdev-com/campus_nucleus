const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const TOKEN = 'PASTE_YOUR_TOKEN_HERE'; // User needs to provide this or I use a known one if available

async function testBookingConflict() {
    const config = { headers: { Authorization: `Bearer ${TOKEN}` } };

    // 1. Get a resource
    const { data: resources } = await axios.get(`${API_URL}/resources`, config);
    if (resources.length === 0) {
        console.log('No resources found to test.');
        return;
    }
    const resourceId = resources[0]._id;
    console.log(`Testing with resource: ${resources[0].name} (${resourceId})`);

    const startTime = new Date();
    startTime.setHours(startTime.getHours() + 24); // Tomorrow
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 2); // 2 hours later

    // 2. Create first booking
    try {
        console.log('Creating first booking...');
        const res1 = await axios.post(`${API_URL}/bookings`, {
            resourceId,
            startTime,
            endTime,
            purpose: 'Conflict Testing - First'
        }, config);
        console.log('First booking created successfully.');

        // 3. Attempt second overlapping booking
        const startOverlap = new Date(startTime);
        startOverlap.setHours(startOverlap.getHours() + 1);
        const endOverlap = new Date(endTime);
        endOverlap.setHours(endOverlap.getHours() + 1);

        console.log('Attempting overlapping booking...');
        try {
            await axios.post(`${API_URL}/bookings`, {
                resourceId,
                startTime: startOverlap,
                endTime: endOverlap,
                purpose: 'Conflict Testing - Overlap'
            }, config);
            console.error('ERROR: Overlapping booking was allowed!');
        } catch (error) {
            if (error.response && error.response.status === 409) {
                console.log('SUCCESS: Overlapping booking correctly rejected with 409 Conflict.');
            } else {
                console.error(`ERROR: Unexpected response: ${error.response?.status} - ${error.response?.data?.message}`);
            }
        }
    } catch (error) {
        console.error('Failed to create first booking:', error.response?.data?.message || error.message);
    }
}

// testBookingConflict();
