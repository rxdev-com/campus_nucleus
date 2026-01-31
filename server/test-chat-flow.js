const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const jar1 = new CookieJar();
const client1 = wrapper(axios.create({ jar: jar1, baseURL: 'http://localhost:5000/api' }));

const jar2 = new CookieJar();
const client2 = wrapper(axios.create({ jar: jar2, baseURL: 'http://localhost:5000/api' }));

async function testChat() {
    try {
        console.log('--- Chat Verification ---');

        // 1. Register User 1 & 2
        const email1 = `user1_${Date.now()}@test.com`;
        const email2 = `user2_${Date.now()}@test.com`;

        const res1 = await client1.post('/auth/register', { name: 'User One', email: email1, password: 'password', department: 'CS', year: 'TY' });
        const res2 = await client2.post('/auth/register', { name: 'User Two', email: email2, password: 'password', department: 'CS', year: 'TY' });

        const token1 = res1.data.token;
        const id1 = res1.data._id;
        const token2 = res2.data.token;
        const id2 = res2.data._id;

        console.log('1. Users Registered:', !!token1 && !!token2);

        // 2. User 1 creates a Club
        // const clubRes = await client1.post('/clubs', {
        //     name: `Test Club ${Date.now()}`,
        //     description: 'Test Club Desc',
        //     leadOrganizerId: id1
        // }, { headers: { Authorization: `Bearer ${token1}` } }); 
        // Allow user to create club if logic permits (or admin). 
        // Note: Controller says Create Club is Private (Admin). 
        // Error: "Not authorized as an admin" likely.

        // Let's Skip Club Chat test if we can't create club easily properly without Admin token.
        // Or create an Admin first? 
        // Assume `seed` works or just test DM first as it's the new feature.

        console.log('2. Direct Message Test');
        // User 1 sends DM to User 2
        const msgRes = await client1.post('/messages', {
            content: 'Hello User Two!',
            contextType: 'direct',
            contextId: id2, // Using Recipient ID as contextId for now
            recipient: id2
        }, { headers: { Authorization: `Bearer ${token1}` } });

        console.log('   Send DM Success:', msgRes.status === 201);

        // User 2 reads DM
        const readRes = await client2.get(`/messages/${id1}?type=direct`, {
            headers: { Authorization: `Bearer ${token2}` }
        });

        console.log('   Read DM Success:', readRes.status === 200);
        console.log('   Message Count:', readRes.data.length);
        console.log('   Content Match:', readRes.data[0].content === 'Hello User Two!');

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

testChat();
