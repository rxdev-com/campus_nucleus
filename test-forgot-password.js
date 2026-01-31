// Quick test script to verify forgot-password endpoint
async function testForgotPassword() {
    try {
        console.log('Testing /api/auth/forgot-password endpoint...');
        const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@campus.com'
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Success!');
            console.log('Response:', data);
            if (data.otp) {
                console.log(`\n🔑 OTP: ${data.otp}`);
            }
        } else {
            console.error('❌ Error:', response.status, data);
        }
    } catch (error) {
        console.error('❌ Network Error:', error.message);
    }
}

testForgotPassword();
