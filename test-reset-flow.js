// Test script for full password reset flow
async function testResetFlow() {
    const email = 'admin@campus.com';
    const newPassword = 'newpassword123';

    try {
        // Step 1: Forgot Password
        console.log('\n1. Testing /api/auth/forgot-password...');
        const forgotRes = await fetch('http://localhost:5000/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const forgotData = await forgotRes.json();

        if (!forgotRes.ok) throw new Error(`Forgot password failed: ${JSON.stringify(forgotData)}`);
        console.log('✅ OTP Sent. OTP:', forgotData.otp);

        const otp = forgotData.otp;
        if (!otp) throw new Error('No OTP returned in dev mode');

        // Step 2: Verify OTP
        console.log('\n2. Testing /api/auth/verify-otp...');
        const verifyRes = await fetch('http://localhost:5000/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        const verifyData = await verifyRes.json();

        if (!verifyRes.ok) throw new Error(`Verify OTP failed: ${JSON.stringify(verifyData)}`);
        console.log('✅ OTP Verified');

        // Step 3: Reset Password
        console.log('\n3. Testing /api/auth/reset-password...');
        const resetRes = await fetch('http://localhost:5000/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, password: newPassword })
        });
        const resetData = await resetRes.json();

        if (!resetRes.ok) throw new Error(`Reset password failed: ${JSON.stringify(resetData)}`);
        console.log('✅ Password Reset Successful');

        // Step 4: Login with new password
        console.log('\n4. Verifying Login with new password...');
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: newPassword })
        });
        const loginData = await loginRes.json();

        if (!loginRes.ok) throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
        console.log('✅ Login Successful. Token received.');

    } catch (error) {
        console.error('❌ Flow Failed:', error.message);
        process.exit(1);
    }
}

testResetFlow();
