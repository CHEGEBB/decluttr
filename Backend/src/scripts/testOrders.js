// TEST SCRIPT - Run this in your backend to debug
// Save as: testOrders.js
// Run with: node testOrders.js

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Import your Order model
const Order = require('../models/Order'); // Adjust path if needed

// Replace with your MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://CHEGEBB:Phil%402003@glamour.cjncwua.mongodb.net/decluttr';

async function testOrders() {
  try {
    console.log('🔍 Testing Order Queries...\n');
    console.log('📡 Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // 1. Get all orders
    console.log('📊 TEST 1: Fetching ALL orders...');
    const allOrders = await Order.find({});
    console.log(`✅ Total orders in DB: ${allOrders.length}\n`);

    if (allOrders.length === 0) {
      console.log('⚠️  No orders found in database!');
      return;
    }

    // 2. Show order details
    allOrders.forEach((order, index) => {
      console.log(`📦 Order ${index + 1}:`);
      console.log(`   ID: ${order._id}`);
      console.log(`   Buyer ID: ${order.buyer}`);
      console.log(`   Total: ${order.totalAmount}`);
      console.log(`   Status: ${order.orderStatus}`);
      console.log(`   Payment Status: ${order.paymentStatus}`);
      console.log(`   Items: ${order.items.length}`);
      
      order.items.forEach((item, i) => {
        console.log(`      Item ${i + 1}:`);
        console.log(`         Product: ${item.product}`);
        console.log(`         Seller: ${item.seller}`);
        console.log(`         Name: ${item.name}`);
        console.log(`         Price: ${item.price}`);
        console.log(`         Type: ${item.listingType}`);
      });
      console.log('');
    });

    // 3. Show all unique seller IDs
    console.log('📊 TEST 2: All unique seller IDs in orders...');
    const uniqueSellers = new Set();
    allOrders.forEach(order => {
      order.items.forEach(item => {
        uniqueSellers.add(item.seller.toString());
      });
    });
    
    console.log('Unique Seller IDs:');
    uniqueSellers.forEach(sellerId => {
      console.log(`   - ${sellerId}`);
    });
    console.log('');

    // 4. Show all unique buyer IDs
    console.log('📊 TEST 3: All unique buyer IDs in orders...');
    const uniqueBuyers = new Set();
    allOrders.forEach(order => {
      uniqueBuyers.add(order.buyer.toString());
    });
    
    console.log('Unique Buyer IDs:');
    uniqueBuyers.forEach(buyerId => {
      console.log(`   - ${buyerId}`);
    });
    console.log('');

    // 5. Test query with specific user ID
    console.log('📊 TEST 4: Testing seller query...');
    console.log('💡 Copy one of the Seller IDs above and paste it below\n');
    
    // REPLACE THIS WITH YOUR USER ID FROM THE BROWSER CONSOLE LOGS
    // Or use one of the seller IDs shown above
    const testUserId = 'PASTE_USER_ID_HERE'; // e.g., '6944ea390299f7c4e5b56e32'
    
    if (testUserId !== 'PASTE_USER_ID_HERE') {
      console.log(`🔍 Searching for orders where seller = ${testUserId}`);
      
      const ordersForSeller = await Order.find({ 'items.seller': testUserId });
      console.log(`✅ Orders found: ${ordersForSeller.length}\n`);
      
      if (ordersForSeller.length > 0) {
        ordersForSeller.forEach((order, index) => {
          console.log(`📦 Order ${index + 1} for seller ${testUserId}:`);
          console.log(`   Order ID: ${order._id}`);
          console.log(`   Items matching seller:`);
          
          order.items.forEach((item, i) => {
            const sellerMatch = item.seller.toString() === testUserId;
            console.log(`      Item ${i + 1}: ${item.name} - Seller: ${item.seller} - Match: ${sellerMatch ? '✅' : '❌'}`);
          });
          console.log('');
        });
      } else {
        console.log('❌ No orders found for this seller ID');
        console.log('💡 This user has no orders where they are the seller\n');
      }
    } else {
      console.log('⚠️  To test a specific user:');
      console.log('   1. Copy a Seller ID from above');
      console.log('   2. Replace PASTE_USER_ID_HERE in the script');
      console.log('   3. Run the script again\n');
    }

    console.log('✅ Tests complete!');
    console.log('\n💡 TROUBLESHOOTING GUIDE:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('🔍 To find out why your orders aren\'t showing:');
    console.log('');
    console.log('1️⃣  Check your browser console logs for:');
    console.log('   "🔍 getReceivedOrders - User ID: XXXXX"');
    console.log('');
    console.log('2️⃣  Compare that User ID with the Seller IDs shown above');
    console.log('');
    console.log('3️⃣  If they DON\'T match:');
    console.log('   → You\'re logged in as a BUYER, not a SELLER');
    console.log('   → These orders were placed BY you, not TO you');
    console.log('   → Use "My Orders" page instead of "Order History"');
    console.log('');
    console.log('4️⃣  If they DO match but still showing 0 orders:');
    console.log('   → There might be a data type conversion issue');
    console.log('   → Use the fixed controller I provided');
    console.log('');
    console.log('5️⃣  To see orders where you\'re the BUYER:');
    console.log('   → Check if your User ID matches any Buyer IDs above');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
}

testOrders();