const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    department: String,
    role: String,
});

const User = mongoose.model('User', userSchema);

const createUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campusnucleus');
        console.log('Connected to MongoDB');

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

        for (const userData of users) {
            const exists = await User.findOne({ email: userData.email });

            if (exists) {
                // Update password
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                await User.updateOne(
                    { email: userData.email },
                    { $set: { password: hashedPassword } }
                );
                console.log(`✅ Updated: ${userData.email} (password reset to default)`);
            } else {
                // Create new
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                await User.create({
                    ...userData,
                    password: hashedPassword
                });
                console.log(`✅ Created: ${userData.email}`);
            }
        }

        console.log('\n🎉 All users ready!');
        console.log('\nLogin credentials:');
        console.log('Admin: admin@campus.com / admin123');
        console.log('Organizer: organizer@campus.com / org123');
        console.log('Participant: participant@campus.com / user123');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createUsers();
