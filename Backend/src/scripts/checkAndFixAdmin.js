// Run this in your backend directory: node checkAndFixAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://juliusmuthoni22_db_user:vmX9mZibMqTXSkqR@cluster0.qaaybno.mongodb.net/decluttr';

async function checkAndFix() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Define User schema inline
    const userSchema = new mongoose.Schema({
      name: String,
      username: String,
      email: String,
      password: String,
      phoneNumber: String,
      location: String,
      role: String,
      isActive: Boolean,
      totalIncome: Number,
      totalExchanges: Number,
      ratings: Number
    }, { timestamps: true });

    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Check if admin exists
    let admin = await User.findOne({ email: 'admin@decluttr.com' });

    if (!admin) {
      console.log('❌ Admin not found. Creating...\n');
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      admin = await User.create({
        name: 'System Administrator',
        username: 'admin',
        email: 'admin@decluttr.com',
        password: hashedPassword,
        phoneNumber: '+254700000000',
        location: 'Nairobi',
        role: 'admin',
        isActive: true,
        totalIncome: 0,
        totalExchanges: 0,
        ratings: 0
      });

      console.log('✅ Admin created!\n');
    } else {
      console.log('✅ Admin found\n');
      
      // Fix role if needed
      if (admin.role !== 'admin') {
        admin.role = 'admin';
        await admin.save();
        console.log('✅ Fixed role\n');
      }

      // Fix active status
      if (!admin.isActive) {
        admin.isActive = true;
        await admin.save();
        console.log('✅ Activated account\n');
      }

      // Reset password to admin123
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash('admin123', salt);
      await admin.save();
      console.log('✅ Password reset to: admin123\n');
    }

    console.log('🎉 ADMIN READY!');
    console.log('================');
    console.log('Email: admin@decluttr.com');
    console.log('Password: admin123');
    console.log('================\n');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAndFix();