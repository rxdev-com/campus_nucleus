const http = require('http');

// Test registration for different roles
function testRegistration(role, roleName) {
    console.log(`\n========== Testing ${roleName} Registration ==========`);

    const userData = {
        name: `Test ${roleName}`,
        email: `test${role}${Date.now()}@example.com`,
        password: 'TestPassword123',
        department: 'Computer Engineering',
        year: 'SY',
        role: role
    };

    console.log('Sending registration request with data:');
    console.log(JSON.stringify(userData, null, 2));
    console.log('\n');

    const postData = JSON.stringify(userData);

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                console.log(`✅ ${roleName} Registration successful!`);
                console.log('Response status:', res.statusCode);
                console.log('Response data:');
                console.log(JSON.parse(data));
            } else {
                console.log(`❌ ${roleName} Registration failed!`);
                console.log('Status:', res.statusCode);
                console.log('Error message:', data);
            }
        });
    });

    req.on('error', (error) => {
        console.log(`❌ ${roleName} Request failed!`);
        console.log('Error:', error.message);
    });

    req.write(postData);
    req.end();
}

// Test all three roles
setTimeout(() => testRegistration('participant', 'Participant'), 0);
setTimeout(() => testRegistration('organizer', 'Organizer'), 1000);
setTimeout(() => testRegistration('admin', 'Admin'), 2000);
