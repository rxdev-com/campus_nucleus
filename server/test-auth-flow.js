const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const jar = new CookieJar();
const client = wrapper(axios.create({ jar, baseURL: 'http://localhost:5000/api/auth' }));

async function testAuth() {
    try {
        console.log('1. Registering User...');
        const email = `test${Date.now()}@example.com`;
        const regRes = await client.post('/register', {
            name: 'Test User',
            email,
            password: 'password123',
            department: 'CS',
            year: 'TY'
        });
        console.log('   Register Success:', regRes.status === 201);
        const token = regRes.data.token;
        console.log('   Access Token:', token ? 'Received' : 'Missing');

        console.log('2. Accessing Profile...');
        const profileRes = await client.get('/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('   Profile Access:', profileRes.status === 200);

        console.log('3. Refreshing Token...');
        const refreshRes = await client.post('/refresh');
        console.log('   Refresh Success:', refreshRes.status === 200);
        console.log('   New Access Token:', refreshRes.data.token ? 'Received' : 'Missing');

        console.log('4. Logout...');
        const logoutRes = await client.post('/logout');
        console.log('   Logout Success:', logoutRes.status === 200);

        console.log('5. Refresh after Logout (Should Fail)...');
        try {
            await client.post('/refresh');
        } catch (error) {
            console.log('   Refresh Failed as expected:', error.response.status === 401);
        }

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

testAuth();
