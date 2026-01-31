// Comprehensive API Testing Script for CampusNucleus
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let adminToken = '';
let organizerToken = '';
let participantToken = '';
let testClubId = '';
let testEventId = '';

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    bold: '\x1b[1m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name, status) {
    const symbol = status ? '✅' : '❌';
    const color = status ? 'green' : 'red';
    log(`${symbol} ${name}`, color);
}

// Test Authentication
async function testAuth() {
    log('\n📝 Testing Authentication Routes...', 'blue');

    try {
        // Login as Admin
        const adminRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@campus.com',
            password: 'admin123'
        });
        adminToken = adminRes.data.token;
        logTest('Admin Login', true);
    } catch (error) {
        logTest('Admin Login', false);
        console.error(error.response?.data || error.message);
    }

    try {
        // Login as Organizer
        const orgRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'organizer@campus.com',
            password: 'org123'
        });
        organizerToken = orgRes.data.token;
        logTest('Organizer Login', true);
    } catch (error) {
        logTest('Organizer Login', false);
    }

    try {
        // Login as Participant
        const partRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'participant@campus.com',
            password: 'user123'
        });
        participantToken = partRes.data.token;
        logTest('Participant Login', true);
    } catch (error) {
        logTest('Participant Login', false);
    }
}

// Test Club Routes
async function testClubs() {
    log('\n🏛️  Testing Club Routes...', 'blue');

    try {
        // Get all clubs
        const clubsRes = await axios.get(`${BASE_URL}/clubs`);
        logTest('GET /clubs', clubsRes.status === 200);
    } catch (error) {
        logTest('GET /clubs', false);
    }

    try {
        // Create club (Admin)
        const createRes = await axios.post(`${BASE_URL}/clubs`, {
            name: `Test Club ${Date.now()}`,
            description: 'Automated test club',
            leadOrganizerId: '507f1f77bcf86cd799439011' // Placeholder, will fail if no real user
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        testClubId = createRes.data._id;
        logTest('POST /clubs (Admin)', createRes.status === 201);
    } catch (error) {
        logTest('POST /clubs (Admin)', false);
        console.log('   Note: Needs valid leadOrganizerId');
    }
}

// Test Event Routes
async function testEvents() {
    log('\n📅 Testing Event Routes...', 'blue');

    try {
        // Get all events
        const eventsRes = await axios.get(`${BASE_URL}/events`);
        logTest('GET /events', eventsRes.status === 200);
    } catch (error) {
        logTest('GET /events', false);
    }

    try {
        // Get joined events (Participant)
        const joinedRes = await axios.get(`${BASE_URL}/events/joined`, {
            headers: { Authorization: `Bearer ${participantToken}` }
        });
        logTest('GET /events/joined', joinedRes.status === 200);
    } catch (error) {
        logTest('GET /events/joined', false);
    }
}

// Test Resource Routes
async function testResources() {
    log('\n🏢 Testing Resource Routes...', 'blue');

    try {
        const resourcesRes = await axios.get(`${BASE_URL}/resources`);
        logTest('GET /resources', resourcesRes.status === 200);
    } catch (error) {
        logTest('GET /resources', false);
    }
}

// Test Messaging Routes
async function testMessaging() {
    log('\n💬 Testing Messaging Routes...', 'blue');

    try {
        // Get messages for a context
        const messagesRes = await axios.get(`${BASE_URL}/messages/507f1f77bcf86cd799439011`, {
            headers: { Authorization: `Bearer ${participantToken}` }
        });
        logTest('GET /messages/:contextId', messagesRes.status === 200);
    } catch (error) {
        logTest('GET /messages/:contextId', false);
    }
}

// Test Activity Logs
async function testActivityLogs() {
    log('\n📋 Testing Activity Log Routes...', 'blue');

    try {
        const logsRes = await axios.get(`${BASE_URL}/activity-logs`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        logTest('GET /activity-logs (Admin)', logsRes.status === 200);
    } catch (error) {
        logTest('GET /activity-logs (Admin)', false);
    }
}

// Test Notifications
async function testNotifications() {
    log('\n🔔 Testing Notification Routes...', 'blue');

    try {
        const notifsRes = await axios.get(`${BASE_URL}/notifications`, {
            headers: { Authorization: `Bearer ${participantToken}` }
        });
        logTest('GET /notifications', notifsRes.status === 200);
    } catch (error) {
        logTest('GET /notifications', false);
    }
}

// Test Analytics
async function testAnalytics() {
    log('\n📊 Testing Analytics Routes...', 'blue');

    try {
        const analyticsRes = await axios.get(`${BASE_URL}/analytics`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        logTest('GET /analytics (Admin)', analyticsRes.status === 200);
    } catch (error) {
        logTest('GET /analytics (Admin)', false);
    }
}

// Run all tests
async function runAllTests() {
    log('\n' + '='.repeat(50), 'bold');
    log('🚀 CampusNucleus API Test Suite', 'bold');
    log('='.repeat(50), 'bold');

    await testAuth();
    await testClubs();
    await testEvents();
    await testResources();
    await testMessaging();
    await testActivityLogs();
    await testNotifications();
    await testAnalytics();

    log('\n' + '='.repeat(50), 'bold');
    log('✨ Test Suite Complete!', 'green');
    log('='.repeat(50), 'bold');
    log('\nNote: Some tests may fail if database is empty or IDs are invalid.', 'yellow');
    log('Run seed scripts first for complete testing.\n', 'yellow');
}

runAllTests().catch(console.error);
