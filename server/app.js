const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');

// Initialize app
const app = express();

// CORS Configuration - AGGRESSIVE (allows all origins for now)
const corsOptions = {
    origin: true, // Allow all origins (use specific origins in production)
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['set-cookie'],
    preflightContinue: false
};

// Middleware - CORS FIRST
app.use(cors(corsOptions));

// Debug logging - log all incoming requests
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
    next();
});

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Static folder
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Routes (Placeholders)
app.get('/', (req, res) => {
    res.send('CampusNucleus API is running...');
});

// CORS test endpoint
app.get('/api/test-cors', (req, res) => {
    res.json({ message: 'CORS is working!', origin: req.headers.origin });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/clubs', require('./routes/clubRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/activity-logs', require('./routes/activityLogRoutes'));

// NOTE: Helmet removed - was blocking CORS headers
// Will add back after CORS is working, with proper configuration

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

module.exports = app;
