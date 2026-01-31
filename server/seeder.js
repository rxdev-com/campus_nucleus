const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Club = require('./models/Club');
const Event = require('./models/Event');
const Resource = require('./models/Resource');
const Booking = require('./models/Booking');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Club.deleteMany();
        await Event.deleteMany();
        await Resource.deleteMany();
        await Booking.deleteMany();

        console.log('Data Destroyed...');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'admin',
                department: 'Administration',
            },
            {
                name: 'Elena Gilbert',
                email: 'organizer@example.com',
                password: hashedPassword,
                role: 'organizer',
                department: 'Computer Science',
                year: 'TY',
            },
            {
                name: 'Stefan Salvatore',
                email: 'student@example.com',
                password: hashedPassword,
                role: 'participant',
                department: 'Information Technology',
                year: 'SY',
            },
        ]);

        const adminUser = users[0]._id;
        const organizerUser = users[1]._id;
        const studentUser = users[2]._id;

        console.log('Users Created...');

        const resources = await Resource.insertMany([
            { name: 'Main Auditorium', type: 'hall', capacity: 500, description: 'Large AC auditorium', location: 'Block A' },
            { name: 'Seminar Hall 1', type: 'hall', capacity: 100, description: 'AV enabled hall', location: 'Block B' },
            { name: 'Innovation Lab', type: 'lab', capacity: 60, description: 'Equipped with NVIDIA RTX workstations', location: 'Block C' },
            { name: 'Sports Complex', type: 'hall', capacity: 1000, description: 'Indoor stadium for major events', location: 'Ground Floor' },
        ]);

        console.log('Resources Created...');

        const clubs = await Club.insertMany([
            {
                name: 'Google Developer Group',
                description: 'Explore the latest in Google technologies, cloud, and mobile development.',
                logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60',
                leadOrganizer: organizerUser,
            },
            {
                name: 'AI & Robotics Club',
                description: 'Building the future of automation through hardware and advanced algorithms.',
                logo: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?w=800&auto=format&fit=crop&q=60',
                leadOrganizer: organizerUser,
            },
            {
                name: 'Visual Arts Society',
                description: 'A community for designers, photographers, and multi-media artists.',
                logo: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=60',
                leadOrganizer: organizerUser,
            }
        ]);

        await User.findByIdAndUpdate(organizerUser, { $push: { managedClubs: { $each: clubs.map(c => c._id) } } });

        console.log('Clubs Created...');

        const events = await Event.insertMany([
            {
                title: 'Neural Network Workshop 2026',
                description: 'Dive deep into deep learning with hands-on sessions on PyTorch and TensorBoard. Learn how to optimize weights for complex datasets.',
                status: 'published',
                organizerClub: clubs[1]._id,
                createdBy: organizerUser,
                timeStart: new Date(Date.now() + 86400000),
                timeEnd: new Date(Date.now() + 90000000),
                venue: 'Innovation Lab',
                budget: 5000,
                imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
                tags: ['AI', 'Tech', 'Workshop']
            },
            {
                title: 'Cloud Architecture Summit',
                description: 'A full-day summit featuring industry experts from AWS, Azure, and Google Cloud talking about the future of serverless.',
                status: 'published',
                organizerClub: clubs[0]._id,
                createdBy: organizerUser,
                timeStart: new Date(Date.now() + 172800000),
                timeEnd: new Date(Date.now() + 259200000),
                venue: 'Main Auditorium',
                budget: 15000,
                imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
                tags: ['Cloud', 'DevOps', 'Professional']
            },
            {
                title: 'Spring Art Expo',
                description: 'Visit the exhibition of visual arts created by our talented students over the last semester.',
                status: 'published',
                organizerClub: clubs[2]._id,
                createdBy: organizerUser,
                timeStart: new Date(Date.now() + 345600000),
                timeEnd: new Date(Date.now() + 432000000),
                venue: 'Seminar Hall 1',
                budget: 2000,
                imageUrl: 'https://images.unsplash.com/photo-1531050171669-011277d13e71?w=1200&auto=format&fit=crop&q=80',
                tags: ['Art', 'Design', 'Cultural']
            }
        ]);

        console.log('Events Created...');

        await Booking.create({
            resource: resources[2]._id,
            bookedBy: organizerUser,
            event: events[0]._id,
            startTime: events[0].timeStart,
            endTime: events[0].timeEnd,
            status: 'approved',
        });

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
