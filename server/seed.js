const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('./models/User');

dotenv.config();

const users = [
    {
        name: 'System Admin',
        email: 'admin@campus.com',
        password: 'admin123',
        department: 'System Core',
        role: 'admin',
    },
    {
        name: 'Event Lead',
        email: 'organizer@campus.com',
        password: 'org123',
        department: 'Event Coordination',
        role: 'organizer',
    },
    {
        name: 'Beta Participant',
        email: 'participant@campus.com',
        password: 'user123',
        department: 'General Registry',
        role: 'participant',
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campusnucleus');
        console.log('Connected to the Nucleus Database.');

        for (const u of users) {
            const userExists = await User.findOne({ email: u.email });
            if (!userExists) {
                await User.create(u);
                console.log(`Initialized account: ${u.email}`);
            } else {
                console.log(`Account already active: ${u.email}`);
            }
        }

        console.log('Grid Seeding Complete.');
        process.exit();
    } catch (error) {
        console.error('Seeding Failed:', error);
        process.exit(1);
    }
};

seedDB();
