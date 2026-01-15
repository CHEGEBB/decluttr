// scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://juliusmuthoni22_db_user:vmX9mZibMqTXSkqR@cluster0.qaaybno.mongodb.net/decluttr');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: 'admin@decluttr.com' },
        { username: 'admin' }
      ]
    });

    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Username: ${existingAdmin.username}`);
      console.log(`Role: ${existingAdmin.role}`);
      
      // Optionally update to admin if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Updated user to admin role');
      }
      
      await mongoose.disconnect();
      return;
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash('password123', 10);

    const adminUser = new User({
      name: 'System Administrator',
      username: 'admin',
      email: 'admin@decluttr.com',
      password: hashedPassword,
      phoneNumber: '+254700000000',
      location: 'Nairobi',
      role: 'admin',
      isActive: true,
      profileImage: null,
      bio: 'System Administrator',
      totalIncome: 0,
      totalExchanges: 0,
      ratings: 0,
      verification: {
        isVerified: true,
        verificationDate: new Date()
      }
    });

    await adminUser.save();
    
    console.log('Admin user created successfully!');
    console.log('===============================');
    console.log('Email: admin@decluttr.com');
    console.log('Username: admin');
    console.log('Password: admin1234');
    console.log('===============================');
    console.log('IMPORTANT: Change the password immediately!');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Add CLI arguments support
const args = process.argv.slice(2);
const customEmail = args[0];
const customPassword = args[1];

if (customEmail && customPassword) {
  // You could modify to use custom credentials
  console.log('Custom credentials provided');
  console.log(`Email: ${customEmail}`);
  console.log(`Password: ${customPassword}`);
}

createAdmin();