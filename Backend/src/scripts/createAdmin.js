// scripts/createAdminUser.js
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://juliusmuthoni22_db_user:vmX9mZibMqTXSkqR@cluster0.qaaybno.mongodb.net/decluttr');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      $or: [
        { email: 'admin@decluttr.com' },
        { username: 'admin' }
      ]
    });

    if (existingAdmin) {
      console.log('\n⚠️  Admin user already exists:');
      console.log('================================');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Username: ${existingAdmin.username}`);
      console.log(`Role: ${existingAdmin.role}`);
      console.log('================================\n');

      // Update to admin if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated user to admin role\n');
      }

      await mongoose.disconnect();
      return;
    }

    // Create new admin user
    const adminUser = new User({
      name: 'System Administrator',
      username: 'admin',
      email: 'admin@decluttr.com',
      password: 'admin123', // This will be hashed by the pre-save hook
      phoneNumber: '+254700000000',
      location: 'Nairobi',
      role: 'admin',
      isActive: true,
      totalIncome: 0,
      totalExchanges: 0,
      ratings: 0
    });

    await adminUser.save();

    console.log('\n✅ Admin user created successfully!');
    console.log('================================');
    console.log('Email: admin@decluttr.com');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('================================');
    console.log('⚠️  IMPORTANT: Change the password immediately after first login!\n');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
};

createAdmin();