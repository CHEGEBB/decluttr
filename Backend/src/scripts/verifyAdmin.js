// scripts/verifyAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const verifyAdmin = async () => {
  try {
    console.log('🔍 Verifying admin setup...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI ||'mongodb+srv://CHEGEBB:Phil%402003@glamour.cjncwua.mongodb.net/decluttr' );
    console.log('✅ Connected to MongoDB\n');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@decluttr.com' }).select('+password');
    
    if (!admin) {
      console.log('❌ Admin user does NOT exist in database');
      console.log('📝 Run: node src/scripts/createAdminUser.js\n');
      await mongoose.disconnect();
      return;
    }

    console.log('✅ Admin user found in database');
    console.log('================================');
    console.log('Email:', admin.email);
    console.log('Username:', admin.username);
    console.log('Name:', admin.name);
    console.log('Role:', admin.role);
    console.log('Active:', admin.isActive);
    console.log('Created:', admin.createdAt);
    console.log('================================\n');

    // Check role
    if (admin.role !== 'admin') {
      console.log('⚠️  WARNING: User role is not "admin"');
      console.log('Updating role to admin...');
      admin.role = 'admin';
      await admin.save();
      console.log('✅ Role updated to admin\n');
    } else {
      console.log('✅ User has admin role\n');
    }

    // Check active status
    if (!admin.isActive) {
      console.log('⚠️  WARNING: User is not active');
      console.log('Activating user...');
      admin.isActive = true;
      await admin.save();
      console.log('✅ User activated\n');
    } else {
      console.log('✅ User is active\n');
    }

    // Test password
    console.log('🔐 Testing password "admin123"...');
    const isPasswordValid = await bcrypt.compare('admin123', admin.password);
    
    if (isPasswordValid) {
      console.log('✅ Password "admin123" is correct\n');
    } else {
      console.log('❌ Password "admin123" is NOT correct');
      console.log('Resetting password to "admin123"...');
      admin.password = 'admin123';
      await admin.save();
      console.log('✅ Password reset to "admin123"\n');
    }

    // Final summary
    console.log('📊 FINAL STATUS:');
    console.log('================================');
    console.log('✅ Admin user exists');
    console.log('✅ Email: admin@decluttr.com');
    console.log('✅ Username: admin');
    console.log('✅ Password: admin123');
    console.log('✅ Role: admin');
    console.log('✅ Status: active');
    console.log('================================\n');

    console.log('🎉 Admin setup is complete and verified!');
    console.log('🔑 You can now login with:');
    console.log('   Email: admin@decluttr.com');
    console.log('   Password: admin123\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
};

verifyAdmin();