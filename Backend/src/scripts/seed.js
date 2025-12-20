// scripts/seedDatabase.js
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
require('dotenv').config();

const mockProducts = [
  {
    name: 'Vintage Leather Jacket Premium',
    description: 'High-quality vintage leather jacket in excellent condition. Perfect for fashion enthusiasts looking for a timeless piece.',
    category: 'Clothes',
    listingType: 'resale',
    price: 4500,
    condition: 'Excellent',
    location: 'Nairobi',
    brand: 'Leather Craft',
    material: 'Genuine Leather',
    color: 'Brown',
    size: 'L',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop',
    tags: ['jacket', 'leather', 'vintage', 'fashion'],
    specifications: {
      'Material': '100% Genuine Leather',
      'Color': 'Dark Brown',
      'Size': 'Large',
      'Style': 'Biker Jacket'
    }
  },
  {
    name: 'Harry Potter Complete Book Set (7 Books)',
    description: 'Complete Harry Potter book series in excellent condition. All 7 books included. Perfect for collectors and fans.',
    category: 'Books',
    listingType: 'donation',
    price: 0,
    condition: 'Like New',
    location: 'Mombasa',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=800&fit=crop',
    tags: ['books', 'harry potter', 'fantasy', 'collection'],
    specifications: {
      'Author': 'J.K. Rowling',
      'Number of Books': '7',
      'Condition': 'Like New',
      'Genre': 'Fantasy'
    }
  },
  {
    name: 'iPhone 12 Pro 256GB',
    description: 'iPhone 12 Pro in good working condition. 256GB storage. Comes with original box and charger.',
    category: 'Electronics',
    listingType: 'resale',
    price: 75000,
    condition: 'Good',
    location: 'Nairobi',
    brand: 'Apple',
    model: 'iPhone 12 Pro',
    color: 'Pacific Blue',
    warranty: 'No warranty',
    image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&h=800&fit=crop',
    tags: ['iphone', 'smartphone', 'apple', 'mobile'],
    specifications: {
      'Storage': '256GB',
      'Color': 'Pacific Blue',
      'Condition': 'Used - Good',
      'Battery Health': '87%'
    }
  },
  {
    name: 'Nike Air Max 270 React',
    description: 'Brand new Nike Air Max 270 React shoes. Never worn, original box included.',
    category: 'Shoes',
    listingType: 'resale',
    price: 9500,
    condition: 'New',
    location: 'Kisumu',
    brand: 'Nike',
    model: 'Air Max 270 React',
    color: 'Black/White',
    size: '42',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
    tags: ['nike', 'shoes', 'sneakers', 'sports'],
    specifications: {
      'Brand': 'Nike',
      'Model': 'Air Max 270 React',
      'Size': '42 (US 9)',
      'Color': 'Black/White'
    }
  },
  {
    name: 'Modern Wooden Study Desk',
    description: 'Modern wooden study desk in excellent condition. Perfect for home office or study room.',
    category: 'Furniture',
    listingType: 'resale',
    price: 15000,
    condition: 'Excellent',
    location: 'Nairobi',
    material: 'Wood',
    color: 'Walnut',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=800&fit=crop',
    tags: ['desk', 'furniture', 'office', 'study'],
    specifications: {
      'Material': 'Solid Wood',
      'Color': 'Walnut',
      'Dimensions': '120cm x 60cm x 75cm',
      'Style': 'Modern'
    }
  },
  {
    name: 'Summer Dresses Bundle (5 Pieces)',
    description: 'Collection of 5 beautiful summer dresses in excellent condition. Various colors and styles. Perfect for donation.',
    category: 'Clothes',
    listingType: 'donation',
    price: 0,
    condition: 'Good',
    location: 'Nakuru',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop',
    tags: ['dresses', 'summer', 'fashion', 'bundle'],
    specifications: {
      'Quantity': '5 pieces',
      'Condition': 'Good',
      'Sizes': 'Mixed (S-L)'
    }
  },
  {
    name: 'Business Books Collection',
    description: 'Collection of popular business and self-help books. Great for students and professionals.',
    category: 'Books',
    listingType: 'resale',
    price: 2800,
    condition: 'Fair',
    location: 'Eldoret',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop',
    tags: ['books', 'business', 'education'],
    specifications: {
      'Genre': 'Business & Self-Help',
      'Condition': 'Fair'
    }
  },
  {
    name: 'Samsung Galaxy Watch 5 Pro',
    description: 'Samsung Galaxy Watch 5 Pro in like new condition. GPS, fitness tracking, and more.',
    category: 'Electronics',
    listingType: 'resale',
    price: 28000,
    condition: 'Like New',
    location: 'Nairobi',
    brand: 'Samsung',
    model: 'Galaxy Watch 5 Pro',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop',
    tags: ['smartwatch', 'samsung', 'fitness', 'wearable'],
    specifications: {
      'Brand': 'Samsung',
      'Model': 'Galaxy Watch 5 Pro',
      'Condition': 'Like New'
    }
  },
  {
    name: 'Ergonomic Leather Office Chair',
    description: 'Premium ergonomic office chair with leather upholstery. Adjustable height and lumbar support.',
    category: 'Furniture',
    listingType: 'resale',
    price: 28000,
    condition: 'Excellent',
    location: 'Mombasa',
    material: 'Leather',
    color: 'Black',
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&h=800&fit=crop',
    tags: ['chair', 'office', 'furniture', 'ergonomic'],
    specifications: {
      'Material': 'Leather',
      'Color': 'Black',
      'Features': 'Adjustable Height, Lumbar Support'
    }
  },
  {
    name: 'Adidas Ultraboost 22 Running Shoes',
    description: 'Adidas Ultraboost 22 running shoes in good condition. Perfect for running and everyday wear.',
    category: 'Shoes',
    listingType: 'donation',
    price: 0,
    condition: 'Good',
    location: 'Nairobi',
    brand: 'Adidas',
    model: 'Ultraboost 22',
    size: '43',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop',
    tags: ['adidas', 'running', 'shoes', 'sports'],
    specifications: {
      'Brand': 'Adidas',
      'Model': 'Ultraboost 22',
      'Size': '43 (US 10)'
    }
  },
  {
    name: 'MacBook Pro 13" M2 2023',
    description: 'Brand new MacBook Pro 13" with M2 chip. Perfect for professionals and creatives.',
    category: 'Electronics',
    listingType: 'resale',
    price: 145000,
    condition: 'New',
    location: 'Nairobi',
    brand: 'Apple',
    model: 'MacBook Pro 13" M2',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop',
    tags: ['macbook', 'laptop', 'apple', 'computer'],
    specifications: {
      'Processor': 'M2 Chip',
      'RAM': '8GB',
      'Storage': '256GB SSD',
      'Screen': '13 inch'
    }
  },
  {
    name: 'Premium Winter Coat',
    description: 'Premium quality winter coat in excellent condition. Warm and stylish.',
    category: 'Clothes',
    listingType: 'resale',
    price: 8500,
    condition: 'Excellent',
    location: 'Kisumu',
    size: 'L',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=800&fit=crop',
    tags: ['coat', 'winter', 'fashion', 'outerwear'],
    specifications: {
      'Size': 'Large',
      'Season': 'Winter'
    }
  },
  {
    name: 'Ray-Ban Aviator Sunglasses',
    description: 'Classic Ray-Ban Aviator sunglasses in like new condition. Includes original case.',
    category: 'Accessories',
    listingType: 'resale',
    price: 12500,
    condition: 'Like New',
    location: 'Nairobi',
    brand: 'Ray-Ban',
    model: 'Aviator',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop',
    tags: ['sunglasses', 'rayban', 'accessories', 'fashion'],
    specifications: {
      'Brand': 'Ray-Ban',
      'Model': 'Aviator',
      'Lens Type': 'Polarized'
    }
  },
  {
    name: 'Apple Watch Series 9',
    description: 'Brand new Apple Watch Series 9 with GPS and cellular. All health and fitness features.',
    category: 'Electronics',
    listingType: 'resale',
    price: 58000,
    condition: 'New',
    location: 'Nairobi',
    brand: 'Apple',
    model: 'Watch Series 9',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
    tags: ['apple watch', 'smartwatch', 'fitness', 'wearable'],
    specifications: {
      'Brand': 'Apple',
      'Model': 'Series 9',
      'Connectivity': 'GPS + Cellular'
    }
  },
  {
    name: 'Modern Glass Coffee Table',
    description: 'Modern glass coffee table in good condition. Perfect for living room.',
    category: 'Furniture',
    listingType: 'donation',
    price: 0,
    condition: 'Good',
    location: 'Nakuru',
    material: 'Glass',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
    tags: ['table', 'furniture', 'living room', 'glass'],
    specifications: {
      'Material': 'Tempered Glass',
      'Style': 'Modern'
    }
  },
  {
    name: 'Gucci GG Marmont Handbag',
    description: 'Authentic Gucci GG Marmont handbag in excellent condition. Comes with authentication card.',
    category: 'Accessories',
    listingType: 'resale',
    price: 65000,
    condition: 'Excellent',
    location: 'Nairobi',
    brand: 'Gucci',
    model: 'GG Marmont',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8R3VjY2klMjBHRyUyME1hcm1vbnQlMjBIYW5kYmFnfGVufDB8fDB8fHww',
    tags: ['gucci', 'handbag', 'luxury', 'designer'],
    specifications: {
      'Brand': 'Gucci',
      'Model': 'GG Marmont',
      'Authenticity': 'Verified'
    }
  },
  {
    name: 'Nike React Infinity Run Flyknit 3',
    description: 'Brand new Nike React Infinity Run Flyknit 3 running shoes. Perfect for long distance running.',
    category: 'Shoes',
    listingType: 'resale',
    price: 13500,
    condition: 'New',
    location: 'Nairobi',
    brand: 'Nike',
    model: 'React Infinity Run Flyknit 3',
    size: '42',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop',
    tags: ['nike', 'running', 'shoes', 'sports'],
    specifications: {
      'Brand': 'Nike',
      'Model': 'React Infinity Run Flyknit 3',
      'Size': '42 (US 9)'
    }
  },
  {
    name: 'JBL PartyBox 310 Bluetooth Speaker',
    description: 'JBL PartyBox 310 portable Bluetooth speaker with light show. Perfect for parties and events.',
    category: 'Electronics',
    listingType: 'resale',
    price: 22000,
    condition: 'Like New',
    location: 'Mombasa',
    brand: 'JBL',
    model: 'PartyBox 310',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop',
    tags: ['speaker', 'bluetooth', 'jbl', 'audio'],
    specifications: {
      'Brand': 'JBL',
      'Model': 'PartyBox 310',
      'Battery Life': '18 hours'
    }
  },
  {
    name: 'Casio G-Shock Digital Watch',
    description: 'Durable Casio G-Shock digital watch in good condition. Water resistant and shock proof.',
    category: 'Accessories',
    listingType: 'resale',
    price: 6500,
    condition: 'Good',
    location: 'Eldoret',
    brand: 'Casio',
    model: 'G-Shock',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=800&fit=crop',
    tags: ['watch', 'casio', 'gshock', 'accessories'],
    specifications: {
      'Brand': 'Casio',
      'Model': 'G-Shock',
      'Water Resistance': '200m'
    }
  },
  {
    name: 'Designer Leather Wallet',
    description: 'Designer leather wallet in fair condition. Multiple card slots and compartments.',
    category: 'Accessories',
    listingType: 'donation',
    price: 0,
    condition: 'Fair',
    location: 'Kisumu',
    material: 'Leather',
    image: 'https://images.unsplash.com/photo-1662261896014-f8bcd9d38e65?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RGVzaWduZXIlMjBMZWF0aGVyJTIwV2FsbGV0fGVufDB8fDB8fHww',
    tags: ['wallet', 'leather', 'accessories'],
    specifications: {
      'Material': 'Genuine Leather',
      'Card Slots': '8'
    }
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Brand new Sony WH-1000XM5 wireless noise-cancelling headphones. Industry-leading sound quality.',
    category: 'Electronics',
    listingType: 'resale',
    price: 38000,
    condition: 'New',
    location: 'Nairobi',
    brand: 'Sony',
    model: 'WH-1000XM5',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
    tags: ['headphones', 'sony', 'audio', 'wireless'],
    specifications: {
      'Brand': 'Sony',
      'Model': 'WH-1000XM5',
      'Noise Cancelling': 'Yes',
      'Battery Life': '30 hours'
    }
  },
  {
    name: 'Linen Shirt Collection',
    description: 'Collection of premium linen shirts in various colors. Perfect for warm weather.',
    category: 'Clothes',
    listingType: 'resale',
    price: 5500,
    condition: 'Good',
    location: 'Nairobi',
    material: 'Linen',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=800&fit=crop',
    tags: ['shirts', 'linen', 'fashion', 'casual'],
    specifications: {
      'Material': '100% Linen',
      'Quantity': '4 shirts',
      'Sizes': 'M-L'
    }
  },
  {
    name: 'Samsung Galaxy S23 Ultra',
    description: 'Samsung Galaxy S23 Ultra in like new condition. 256GB storage, excellent camera.',
    category: 'Electronics',
    listingType: 'resale',
    price: 110000,
    condition: 'Like New',
    location: 'Nairobi',
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop',
    tags: ['samsung', 'smartphone', 'android', 'mobile'],
    specifications: {
      'Storage': '256GB',
      'Camera': '200MP Main',
      'Battery': '5000mAh'
    }
  },
  {
    name: 'Leather Boots Collection',
    description: 'Premium leather boots in excellent condition. Perfect for any occasion.',
    category: 'Shoes',
    listingType: 'resale',
    price: 16500,
    condition: 'Excellent',
    location: 'Mombasa',
    material: 'Leather',
    size: '42',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop',
    tags: ['boots', 'leather', 'shoes', 'fashion'],
    specifications: {
      'Material': 'Genuine Leather',
      'Size': '42',
      'Style': 'Chelsea Boots'
    }
  },
  {
    name: 'Digital Camera Canon EOS R5',
    description: 'Brand new Canon EOS R5 professional mirrorless camera. Perfect for photography enthusiasts.',
    category: 'Electronics',
    listingType: 'resale',
    price: 245000,
    condition: 'New',
    location: 'Nairobi',
    brand: 'Canon',
    model: 'EOS R5',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop',
    tags: ['camera', 'canon', 'photography', 'professional'],
    specifications: {
      'Brand': 'Canon',
      'Model': 'EOS R5',
      'Megapixels': '45MP',
      'Video': '8K'
    }
  },
  {
    name: 'Designer Backpack',
    description: 'Premium designer backpack in excellent condition. Multiple compartments and laptop sleeve.',
    category: 'Accessories',
    listingType: 'resale',
    price: 14500,
    condition: 'Excellent',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1622560481979-f5b0174242a0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8RGVzaWduZXIlMjBCYWNrcGFja3xlbnwwfHwwfHx8MA%3D%3D',
    tags: ['backpack', 'bag', 'accessories', 'travel'],
    specifications: {
      'Laptop Compartment': 'Up to 15 inch',
      'Material': 'Premium Canvas',
      'Capacity': '25L'
    }
  },
  {
    name: 'Gaming Laptop ASUS ROG',
    description: 'ASUS ROG gaming laptop in like new condition. Perfect for gaming and content creation.',
    category: 'Electronics',
    listingType: 'resale',
    price: 165000,
    condition: 'Like New',
    location: 'Nairobi',
    brand: 'ASUS',
    model: 'ROG Strix',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop',
    tags: ['laptop', 'gaming', 'asus', 'computer'],
    specifications: {
      'Processor': 'Intel i7',
      'RAM': '16GB',
      'Graphics': 'RTX 3060',
      'Storage': '512GB SSD'
    }
  },
  {
    name: 'Classic Novels Collection',
    description: 'Collection of classic novels including works by Dickens, Austen, and more.',
    category: 'Books',
    listingType: 'donation',
    price: 0,
    condition: 'Good',
    location: 'Nakuru',
    image: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=800&h=800&fit=crop',
    tags: ['books', 'classics', 'literature', 'collection'],
    specifications: {
      'Genre': 'Classic Literature',
      'Quantity': 'Approx. 15 books'
    }
  },
  {
    name: 'Standing Desk Adjustable',
    description: 'Brand new electric standing desk with height adjustment. Perfect for home office.',
    category: 'Furniture',
    listingType: 'resale',
    price: 42000,
    condition: 'New',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1762681829669-2cd09f21ad7a?w=800&auto=format&fit=crop&q=60',
    tags: ['desk', 'standing desk', 'office', 'furniture'],
    specifications: {
      'Height Range': '70cm - 120cm',
      'Desk Size': '140cm x 70cm',
      'Weight Capacity': '80kg'
    }
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Premium eco-friendly yoga mat with carrying strap. Non-slip surface.',
    category: 'Sports',
    listingType: 'resale',
    price: 3200,
    condition: 'Excellent',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1758599881359-a3f089f33502?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fFlvZ2ElMjBNYXQlMjBQcmVtaXVtfGVufDB8fDB8fHww',
    tags: ['yoga', 'fitness', 'sports', 'exercise'],
    specifications: {
      'Material': 'Eco-friendly TPE',
      'Thickness': '6mm',
      'Size': '183cm x 61cm'
    }
  },
  {
    name: 'Smart TV 55" Samsung',
    description: 'Samsung 55" 4K Smart TV in like new condition. Crystal clear picture quality.',
    category: 'Electronics',
    listingType: 'resale',
    price: 105000,
    condition: 'Like New',
    location: 'Mombasa',
    brand: 'Samsung',
    model: '55" Crystal UHD',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop',
    tags: ['tv', 'samsung', 'smart tv', 'electronics'],
    specifications: {
      'Screen Size': '55 inch',
      'Resolution': '4K UHD',
      'Smart Features': 'Yes'
    }
  },
  {
    name: 'Dinnerware Set 12 Pieces',
    description: 'Complete 12-piece dinnerware set in good condition. Perfect for family meals.',
    category: 'Home',
    listingType: 'donation',
    price: 0,
    condition: 'Good',
    location: 'Kisumu',
    image: 'https://images.unsplash.com/photo-1561404672-0c8d7f5f6824?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fERpbm5lcndhcmUlMjBTZXQlMjAxMiUyMFBpZWNlc3xlbnwwfHwwfHx8MA%3D%3D',
    tags: ['dinnerware', 'kitchen', 'home', 'dining'],
    specifications: {
      'Pieces': '12 (4 plates, 4 bowls, 4 mugs)',
      'Material': 'Ceramic'
    }
  },
  {
    name: 'Mountain Bike Trek',
    description: 'Trek mountain bike in excellent condition. Perfect for trails and off-road adventures.',
    category: 'Sports',
    listingType: 'resale',
    price: 65000,
    condition: 'Excellent',
    location: 'Nairobi',
    brand: 'Trek',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=800&fit=crop',
    tags: ['bike', 'mountain bike', 'sports', 'cycling'],
    specifications: {
      'Brand': 'Trek',
      'Frame Size': 'Large',
      'Gears': '21-speed'
    }
  },
  {
    name: 'Cookbook Collection',
    description: 'Collection of popular cookbooks featuring various cuisines from around the world.',
    category: 'Books',
    listingType: 'resale',
    price: 4800,
    condition: 'Good',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1565951556573-1beb896beb26?w=800&auto=format&fit=crop&q=60',
    tags: ['cookbooks', 'cooking', 'recipes', 'books'],
    specifications: {
      'Quantity': '8 books',
      'Cuisines': 'International'
    }
  },
  {
    name: 'Blender Professional',
    description: 'Professional high-speed blender in like new condition. Perfect for smoothies and more.',
    category: 'Home',
    listingType: 'resale',
    price: 9500,
    condition: 'Like New',
    location: 'Nairobi',
    image: 'https://plus.unsplash.com/premium_photo-1718043036199-d98bef36af46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8QmxlbmRlcnxlbnwwfHwwfHx8MA%3D%3D',
    tags: ['blender', 'kitchen', 'appliance', 'home'],
    specifications: {
      'Power': '1000W',
      'Capacity': '2L',
      'Speeds': 'Variable + Pulse'
    }
  },
  {
    name: 'Gaming Console PS5',
    description: 'Brand new PlayStation 5 gaming console with disc drive. Includes controller.',
    category: 'Electronics',
    listingType: 'resale',
    price: 85000,
    condition: 'New',
    location: 'Nairobi',
    brand: 'Sony',
    model: 'PlayStation 5',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=800&fit=crop',
    tags: ['ps5', 'gaming', 'console', 'playstation'],
    specifications: {
      'Brand': 'Sony',
      'Model': 'PlayStation 5',
      'Storage': '825GB'
    }
  },
  {
    name: 'Designer Jeans Collection',
    description: 'Collection of premium designer jeans in various styles. Excellent condition.',
    category: 'Clothes',
    listingType: 'resale',
    price: 10500,
    condition: 'Excellent',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop',
    tags: ['jeans', 'denim', 'fashion', 'designer'],
    specifications: {
      'Quantity': '3 pairs',
      'Sizes': '32-34',
      'Styles': 'Slim Fit, Straight Cut'
    }
  },
  {
    name: 'Coffee Machine Deluxe',
    description: 'Deluxe espresso coffee machine in like new condition. Perfect for coffee enthusiasts.',
    category: 'Home',
    listingType: 'resale',
    price: 24500,
    condition: 'Like New',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1642466075403-cc922174becf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fENvZmZlZSUyME1hY2hpbmUlMjBEZWx1eGV8ZW58MHx8MHx8fDA%3D',
    tags: ['coffee', 'espresso', 'machine', 'home'],
    specifications: {
      'Type': 'Espresso Machine',
      'Pressure': '15 bar',
      'Features': 'Milk Frother'
    }
  },
  {
    name: 'Tennis Racket Professional',
    description: 'Brand new professional tennis racket. Perfect for competitive play.',
    category: 'Sports',
    listingType: 'resale',
    price: 12500,
    condition: 'New',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=800&fit=crop',
    tags: ['tennis', 'racket', 'sports', 'professional'],
    specifications: {
      'Head Size': '100 sq in',
      'Weight': '300g',
      'Grip Size': '4 1/4'
    }
  },
  {
    name: 'Board Games Collection',
    description: 'Collection of popular family board games. Perfect for game nights and entertaining.',
    category: 'Entertainment',
    listingType: 'donation',
    price: 0,
    condition: 'Good',
    location: 'Nakuru',
    image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&h=800&fit=crop',
    tags: ['board games', 'entertainment', 'family', 'games'],
    specifications: {
      'Quantity': '5 games',
      'Age Range': '8+'
    }
  },
  {
    name: 'Digital Piano Yamaha',
    description: 'Yamaha digital piano in excellent condition. 88 weighted keys, perfect for learning.',
    category: 'Entertainment',
    listingType: 'resale',
    price: 95000,
    condition: 'Excellent',
    location: 'Nairobi',
    brand: 'Yamaha',
    image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=800&fit=crop',
    tags: ['piano', 'yamaha', 'music', 'instrument'],
    specifications: {
      'Brand': 'Yamaha',
      'Keys': '88 Weighted',
      'Voices': '10 Premium'
    }
  },
  {
    name: 'Fitness Tracker Band',
    description: 'Fitness tracker band with heart rate monitoring and step counting. Good condition.',
    category: 'Electronics',
    listingType: 'resale',
    price: 6500,
    condition: 'Good',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800&h=800&fit=crop',
    tags: ['fitness', 'tracker', 'wearable', 'health'],
    specifications: {
      'Features': 'Heart Rate, Steps, Sleep',
      'Battery Life': '7 days',
      'Water Resistant': 'Yes'
    }
  },
  {
    name: 'Art Supplies Collection',
    description: 'Complete art supplies collection including paints, brushes, canvases and more.',
    category: 'Arts',
    listingType: 'donation',
    price: 0,
    condition: 'Fair',
    location: 'Kisumu',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=800&fit=crop',
    tags: ['art', 'supplies', 'painting', 'creative'],
    specifications: {
      'Includes': 'Paints, Brushes, Canvases',
      'Quantity': 'Full Set'
    }
  },
  {
    name: 'Camping Tent 4 Person',
    description: 'Four-person camping tent in excellent condition. Waterproof and easy to set up.',
    category: 'Sports',
    listingType: 'resale',
    price: 22500,
    condition: 'Excellent',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1703304862580-206bdf82fbc8?w=800&auto=format&fit=crop&q=60',
    tags: ['tent', 'camping', 'outdoor', 'sports'],
    specifications: {
      'Capacity': '4 Person',
      'Waterproof': 'Yes',
      'Setup': 'Easy Pop-up'
    }
  },
  {
    name: 'Designer Watch Rolex',
    description: 'Authentic Rolex watch in brand new condition. Comes with box and papers.',
    category: 'Accessories',
    listingType: 'resale',
    price: 850000,
    condition: 'New',
    location: 'Nairobi',
    brand: 'Rolex',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop',
    tags: ['rolex', 'watch', 'luxury', 'designer'],
    specifications: {
      'Brand': 'Rolex',
      'Movement': 'Automatic',
      'Water Resistance': '100m',
      'Authenticity': 'Verified'
    }
  },
  {
    name: 'Kitchen Knife Set',
    description: 'Brand new professional kitchen knife set with 8 pieces. Perfect for home chefs.',
    category: 'Home',
    listingType: 'resale',
    price: 12500,
    condition: 'New',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1589071634465-75d7ce737fa8?w=800&auto=format&fit=crop&q=60',
    tags: ['knives', 'kitchen', 'cooking', 'home'],
    specifications: {
      'Pieces': '8',
      'Material': 'Stainless Steel',
      'Includes': 'Wooden Block'
    }
  },
  {
    name: 'Sofa Bed Convertible',
    description: 'Convertible sofa bed in like new condition. Perfect for small spaces.',
    category: 'Furniture',
    listingType: 'resale',
    price: 95000,
    condition: 'Like New',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1669004753992-cfe24bd8410b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8U29mYSUyMEJlZCUyMENvbnZlcnRpYmxlfGVufDB8fDB8fHww',
    tags: ['sofa', 'furniture', 'bed', 'convertible'],
    specifications: {
      'Type': 'Sofa Bed',
      'Seating Capacity': '3 Person',
      'Bed Size': 'Queen'
    }
  },
  {
    name: 'Laptop Bag Premium',
    description: 'Premium laptop bag in excellent condition. Multiple compartments and padded protection.',
    category: 'Accessories',
    listingType: 'resale',
    price: 9500,
    condition: 'Excellent',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
    tags: ['laptop bag', 'bag', 'accessories', 'business'],
    specifications: {
      'Laptop Size': 'Up to 15.6 inch',
      'Material': 'Premium Nylon',
      'Compartments': 'Multiple'
    }
  },
  {
    name: 'Womens Winter Boots',
    description: 'Stylish winter boots for women in excellent condition. Waterproof and warm.',
    category: 'Shoes',
    listingType: 'resale',
    price: 7800,
    condition: 'Excellent',
    location: 'Nairobi',
    size: '38',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop',
    tags: ['boots', 'winter', 'women', 'shoes'],
    specifications: {
      'Size': '38',
      'Material': 'Synthetic Leather',
      'Waterproof': 'Yes'
    }
  },
  {
    name: 'Childrens Story Books',
    description: 'Collection of childrens story books in good condition. Perfect for young readers.',
    category: 'Books',
    listingType: 'donation',
    price: 0,
    condition: 'Good',
    location: 'Mombasa',
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&h=800&fit=crop',
    tags: ['children', 'books', 'stories', 'education'],
    specifications: {
      'Age Range': '3-8 years',
      'Quantity': '12 books'
    }
  },
  {
    name: 'Bluetooth Earbuds Wireless',
    description: 'Wireless Bluetooth earbuds in like new condition. Good battery life and sound quality.',
    category: 'Electronics',
    listingType: 'resale',
    price: 4500,
    condition: 'Like New',
    location: 'Nairobi',
    brand: 'Xiaomi',
    image: 'https://images.unsplash.com/photo-1715371941196-c4c8750f270f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Ymx1ZXR0b3RoJTIwZWFyYnVkc3xlbnwwfHwwfHx8MA%3D%3D',
    tags: ['earbuds', 'bluetooth', 'wireless', 'audio'],
    specifications: {
      'Battery Life': '6 hours',
      'Charging Case': 'Yes',
      'Water Resistant': 'IPX4'
    }
  },
  {
    name: 'Office Filing Cabinet',
    description: 'Two-drawer office filing cabinet in good condition. Perfect for organizing documents.',
    category: 'Furniture',
    listingType: 'resale',
    price: 12000,
    condition: 'Good',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop',
    tags: ['cabinet', 'office', 'storage', 'furniture'],
    specifications: {
      'Drawers': '2',
      'Material': 'Metal',
      'Lockable': 'Yes'
    }
  },
  {
    name: 'Mens Formal Shoes',
    description: 'Mens formal leather shoes in excellent condition. Perfect for office or special occasions.',
    category: 'Shoes',
    listingType: 'resale',
    price: 6800,
    condition: 'Excellent',
    location: 'Nairobi',
    size: '42',
    image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=800&fit=crop',
    tags: ['shoes', 'formal', 'leather', 'men'],
    specifications: {
      'Size': '42',
      'Material': 'Genuine Leather',
      'Color': 'Black'
    }
  },
  {
    name: 'Electric Kettle',
    description: 'Electric kettle in good working condition. Fast boiling, automatic shut-off.',
    category: 'Home',
    listingType: 'resale',
    price: 2800,
    condition: 'Good',
    location: 'Kisumu',
    image: 'https://images.unsplash.com/photo-1650940925927-f4a30c930a4d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8RWxlY3RyaWMlMjBLZXR0bGV8ZW58MHx8MHx8fDA%3D',
    tags: ['kettle', 'kitchen', 'appliance', 'home'],
    specifications: {
      'Capacity': '1.7L',
      'Power': '1500W',
      'Material': 'Stainless Steel'
    }
  },
  {
    name: 'Basketball & Pump',
    description: 'Official size basketball with air pump. Good condition, perfect for practice.',
    category: 'Sports',
    listingType: 'donation',
    price: 0,
    condition: 'Good',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=800&fit=crop',
    tags: ['basketball', 'sports', 'outdoor', 'equipment'],
    specifications: {
      'Size': 'Official Size 7',
      'Includes': 'Air Pump',
      'Condition': 'Good'
    }
  },
  {
    name: 'Graphic Design Tablet',
    description: 'Wacom graphic design tablet in excellent condition. Perfect for digital artists.',
    category: 'Electronics',
    listingType: 'resale',
    price: 22000,
    condition: 'Excellent',
    location: 'Nairobi',
    brand: 'Wacom',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop',
    tags: ['tablet', 'graphic', 'design', 'art'],
    specifications: {
      'Brand': 'Wacom',
      'Active Area': '8.7 x 5.8 inch',
      'Pressure Levels': '4096'
    }
  },
  {
    name: 'Kitchen Mixer Stand',
    description: 'Kitchen stand mixer in like new condition. Multiple attachments included.',
    category: 'Home',
    listingType: 'resale',
    price: 18500,
    condition: 'Like New',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1758565810987-ca8d617ea7be?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8S2l0Y2hlbiUyME1peGVyJTIwU3RhbmR8ZW58MHx8MHx8fDA%3D',
    tags: ['mixer', 'kitchen', 'appliance', 'baking'],
    specifications: {
      'Power': '300W',
      'Attachments': '3 included',
      'Bowl Capacity': '4.8L'
    }
  },
  {
    name: 'Travel Luggage Set',
    description: '3-piece travel luggage set in good condition. Various sizes for different trips.',
    category: 'Accessories',
    listingType: 'resale',
    price: 16500,
    condition: 'Good',
    location: 'Mombasa',
    image: 'https://images.unsplash.com/photo-1672625912400-35f1f7bca79b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8VHJhdmVsJTIwTHVnZ2FnZSUyMFNldHxlbnwwfHwwfHx8MA%3D%3D',
    tags: ['luggage', 'travel', 'bags', 'accessories'],
    specifications: {
      'Pieces': '3',
      'Material': 'Polycarbonate',
      'Wheels': 'Spinner Wheels'
    }
  },
  {
    name: 'Science Textbooks',
    description: 'Collection of science textbooks for high school students. Various subjects.',
    category: 'Books',
    listingType: 'resale',
    price: 4200,
    condition: 'Fair',
    location: 'Nakuru',
    image: 'https://images.unsplash.com/photo-1725869973689-425c74f79a48?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2NpZW5jZSUyMHRleHRib29rc3xlbnwwfHwwfHx8MA%3D%3D',
    tags: ['textbooks', 'science', 'education', 'school'],
    specifications: {
      'Subjects': 'Physics, Chemistry, Biology',
      'Quantity': '6 books',
      'Level': 'High School'
    }
  },
  {
    name: 'Gaming Mouse RGB',
    description: 'RGB gaming mouse with programmable buttons. Excellent condition.',
    category: 'Electronics',
    listingType: 'resale',
    price: 3800,
    condition: 'Excellent',
    location: 'Nairobi',
    brand: 'Logitech',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=800&fit=crop',
    tags: ['gaming', 'mouse', 'computer', 'accessories'],
    specifications: {
      'Brand': 'Logitech',
      'DPI': '16000',
      'Buttons': '8 Programmable',
      'RGB': 'Yes'
    }
  },
  {
    name: 'Bedside Table',
    description: 'Wooden bedside table with drawer. Good condition, perfect for bedroom.',
    category: 'Furniture',
    listingType: 'resale',
    price: 6800,
    condition: 'Good',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QmVkc2lkZSUyMFRhYmxlfGVufDB8fDB8fHww',
    tags: ['table', 'bedside', 'furniture', 'bedroom'],
    specifications: {
      'Material': 'Wood',
      'Drawer': 'Yes',
      'Dimensions': '50cm x 40cm x 45cm'
    }
  },
  {
    name: 'Womens Handbag Leather',
    description: 'Genuine leather handbag for women in excellent condition. Multiple compartments.',
    category: 'Accessories',
    listingType: 'resale',
    price: 8500,
    condition: 'Excellent',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop',
    tags: ['handbag', 'leather', 'women', 'accessories'],
    specifications: {
      'Material': 'Genuine Leather',
      'Compartments': 'Multiple',
      'Color': 'Brown'
    }
  },
  {
    name: 'Football Jersey Collection',
    description: 'Collection of authentic football jerseys from various teams. Good condition.',
    category: 'Clothes',
    listingType: 'resale',
    price: 4500,
    condition: 'Good',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1662096909687-7c64cde3524b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fEZvb3RiYWxsJTIwSmVyc2V5JTIwQ29sbGVjdGlvbnxlbnwwfHwwfHx8MA%3D%3D',
    tags: ['jerseys', 'football', 'sports', 'collection'],
    specifications: {
      'Quantity': '5 jerseys',
      'Sizes': 'L-XL',
      'Teams': 'Various'
    }
  },
  {
    name: 'External Hard Drive 2TB',
    description: '2TB external hard drive in excellent condition. Perfect for backup and storage.',
    category: 'Electronics',
    listingType: 'resale',
    price: 9500,
    condition: 'Excellent',
    location: 'Nairobi',
    brand: 'WD',
    image: 'https://plus.unsplash.com/premium_photo-1723651280322-513220315969?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZXh0ZXJuYWwlMjBoYXJkJTIwZHJpdmV8ZW58MHx8MHx8fDA%3D',
    tags: ['hard drive', 'storage', 'backup', 'computer'],
    specifications: {
      'Brand': 'Western Digital',
      'Capacity': '2TB',
      'Interface': 'USB 3.0'
    }
  },
  {
    name: 'Kitchen Storage Containers',
    description: 'Set of glass kitchen storage containers with lids. Perfect for pantry organization.',
    category: 'Home',
    listingType: 'donation',
    price: 0,
    condition: 'Good',
    location: 'Kisumu',
    image: 'https://images.unsplash.com/photo-1763432128869-8ebe2630280d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8S2l0Y2hlbiUyMFN0b3JhZ2UlMjBDb250YWluZXJzfGVufDB8fDB8fHww',
    tags: ['containers', 'kitchen', 'storage', 'home'],
    specifications: {
      'Pieces': '8 containers',
      'Material': 'Glass',
      'Lids': 'Silicone Sealed'
    }
  },
  {
    name: 'Running Shorts Collection',
    description: 'Collection of running shorts in good condition. Various sizes and colors.',
    category: 'Clothes',
    listingType: 'resale',
    price: 2800,
    condition: 'Good',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',
    tags: ['shorts', 'running', 'sports', 'athletic'],
    specifications: {
      'Quantity': '6 pairs',
      'Sizes': 'M-L',
      'Material': 'Polyester'
    }
  },
  {
    name: 'Desk Lamp LED',
    description: 'LED desk lamp with adjustable brightness. Perfect for studying or working.',
    category: 'Home',
    listingType: 'resale',
    price: 3500,
    condition: 'Excellent',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop',
    tags: ['lamp', 'desk', 'lighting', 'home'],
    specifications: {
      'Light Type': 'LED',
      'Brightness': 'Adjustable',
      'Color Temperature': 'Warm White'
    }
  },
  {
    name: 'Board Game Monopoly',
    description: 'Classic Monopoly board game in good condition. All pieces included.',
    category: 'Entertainment',
    listingType: 'donation',
    price: 0,
    condition: 'Good',
    location: 'Nakuru',
    image: 'https://images.unsplash.com/photo-1640461470346-c8b56497850a?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['board game', 'monopoly', 'family', 'games'],
    specifications: {
      'Game': 'Monopoly',
      'Pieces': 'Complete Set',
      'Age': '8+'
    }
  },
  {
    name: 'Wireless Keyboard',
    description: 'Wireless keyboard with numeric pad. Good condition, long battery life.',
    category: 'Electronics',
    listingType: 'resale',
    price: 4200,
    condition: 'Good',
    location: 'Nairobi',
    brand: 'Logitech',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=800&fit=crop',
    tags: ['keyboard', 'wireless', 'computer', 'accessories'],
    specifications: {
      'Brand': 'Logitech',
      'Connection': 'Bluetooth',
      'Battery Life': '24 months'
    }
  },
  {
    name: 'Yoga Blocks (2 pieces)',
    description: 'Pair of yoga blocks in excellent condition. Perfect for yoga practice.',
    category: 'Sports',
    listingType: 'resale',
    price: 1800,
    condition: 'Excellent',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&h=800&fit=crop',
    tags: ['yoga', 'blocks', 'fitness', 'exercise'],
    specifications: {
      'Quantity': '2 blocks',
      'Material': 'EVA Foam',
      'Size': 'Standard'
    }
  },
  {
    name: 'Cookware Set Non-stick',
    description: 'Non-stick cookware set in good condition. Includes pots and pans.',
    category: 'Home',
    listingType: 'resale',
    price: 12500,
    condition: 'Good',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1588279102558-dabc7b32d9b1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q29va3dhcmUlMjBTZXQlMjBOb24tc3RpY2t8ZW58MHx8MHx8fDA%3D',
    tags: ['cookware', 'kitchen', 'pots', 'pans'],
    specifications: {
      'Pieces': '5 pieces',
      'Coating': 'Non-stick',
      'Material': 'Aluminum'
    }
  },
  {
    name: 'Graphic Novels Collection',
    description: 'Collection of popular graphic novels and comics. Good condition for readers.',
    category: 'Books',
    listingType: 'resale',
    price: 5800,
    condition: 'Good',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=800&fit=crop',
    tags: ['graphic novels', 'comics', 'books', 'collection'],
    specifications: {
      'Quantity': '10 books',
      'Genres': 'Superhero, Fantasy',
      'Condition': 'Good'
    }
  },
  {
    name: 'Portable Power Bank',
    description: '20000mAh power bank with fast charging. Excellent condition.',
    category: 'Electronics',
    listingType: 'resale',
    price: 5500,
    condition: 'Excellent',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1614399113305-a127bb2ca893?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG93ZXJiYW5rfGVufDB8fDB8fHww',
    tags: ['power bank', 'charger', 'portable', 'electronics'],
    specifications: {
      'Capacity': '20000mAh',
      'Ports': '2 USB, 1 Type-C',
      'Fast Charge': 'Yes'
    }
  },
  {
    name: 'Throw Pillows Set',
    description: 'Set of decorative throw pillows in excellent condition. Various patterns.',
    category: 'Home',
    listingType: 'resale',
    price: 3800,
    condition: 'Excellent',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1638191376884-f371a22c719f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8VGhyb3clMjBQaWxsb3dzJTIwU2V0fGVufDB8fDB8fHww',
    tags: ['pillows', 'decor', 'home', 'living room'],
    specifications: {
      'Quantity': '4 pillows',
      'Size': '45x45cm',
      'Material': 'Polyester'
    }
  },
  {
    name: 'Treadmill Home Use',
    description: 'Home use treadmill in good working condition. Foldable for storage.',
    category: 'Sports',
    listingType: 'resale',
    price: 55000,
    condition: 'Good',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1723468353356-e18254cd8a63?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8VHJlYWRtaWxsJTIwSG9tZSUyMFVzZXxlbnwwfHwwfHx8MA%3D%3D',
    tags: ['treadmill', 'fitness', 'exercise', 'home'],
    specifications: {
      'Motor': '2.0 HP',
      'Max Speed': '12 km/h',
      'Foldable': 'Yes'
    }
  },
  {
    name: 'Water Bottle Insulated',
    description: 'Insulated stainless steel water bottle. Keeps drinks cold/hot for hours.',
    category: 'Accessories',
    listingType: 'resale',
    price: 2500,
    condition: 'Excellent',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1585975766936-6eaae1596918?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8V2F0ZXIlMjBCb3R0bGUlMjBJbnN1bGF0ZWR8ZW58MHx8MHx8fDA%3D',
    tags: ['water bottle', 'insulated', 'outdoor', 'accessories'],
    specifications: {
      'Capacity': '1L',
      'Material': 'Stainless Steel',
      'Insulation': '24 hours'
    }
  },
  {
    name: 'Textbooks University Level',
    description: 'University level textbooks in various subjects. Good condition for students.',
    category: 'Books',
    listingType: 'resale',
    price: 6800,
    condition: 'Good',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1731983568664-9c1d8a87e7a2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8VGV4dGJvb2tzJTIwVW5pdmVyc2l0eSUyMExldmVsfGVufDB8fDB8fHww',
    tags: ['textbooks', 'university', 'education', 'academic'],
    specifications: {
      'Quantity': '8 books',
      'Subjects': 'Engineering, Business',
      'Level': 'University'
    }
  },
  {
    name: 'Gaming Chair Ergonomic',
    description: 'Ergonomic gaming chair with lumbar support. Excellent condition.',
    category: 'Furniture',
    listingType: 'resale',
    price: 28000,
    condition: 'Excellent',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1760278042167-2e42c883e087?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8R2FtaW5nJTIwQ2hhaXIlMjBFcmdvbm9taWN8ZW58MHx8MHx8fDA%3D',
    tags: ['gaming chair', 'ergonomic', 'furniture', 'office'],
    specifications: {
      'Adjustable': 'Height, Armrests',
      'Lumbar Support': 'Yes',
      'Material': 'PU Leather'
    }
  },
  {
    name: 'Wall Clock Modern',
    description: 'Modern wall clock in excellent condition. Silent movement, battery operated.',
    category: 'Home',
    listingType: 'resale',
    price: 3200,
    condition: 'Excellent',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1765423587697-e2f0998b904d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8V2FsbCUyMENsb2NrJTIwTW9kZXJufGVufDB8fDB8fHww',
    tags: ['clock', 'wall', 'decor', 'home'],
    specifications: {
      'Diameter': '40cm',
      'Movement': 'Quartz',
      'Battery': 'AA (included)'
    }
  },
  {
    name: 'Baby Clothes Bundle',
    description: 'Bundle of baby clothes in good condition. Various sizes 0-12 months.',
    category: 'Clothes',
    listingType: 'donation',
    price: 0,
    condition: 'Good',
    location: 'Nairobi',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=800&fit=crop',
    tags: ['baby', 'clothes', 'infant', 'donation'],
    specifications: {
      'Quantity': '15 pieces',
      'Sizes': '0-12 months',
      'Gender': 'Unisex'
    }
  },
  {
    name: 'Computer Monitor 24"',
    description: '24-inch computer monitor in excellent condition. Full HD resolution.',
    category: 'Electronics',
    listingType: 'resale',
    price: 18500,
    condition: 'Excellent',
    location: 'Nairobi',
    brand: 'Dell',
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=800&fit=crop',
    tags: ['monitor', 'computer', 'display', 'electronics'],
    specifications: {
      'Brand': 'Dell',
      'Size': '24 inch',
      'Resolution': '1920x1080',
      'Refresh Rate': '60Hz'
    }
  },
  {
    name: 'Gardening Tools Set',
    description: 'Complete gardening tools set in good condition. Perfect for home gardening.',
    category: 'Home',
    listingType: 'resale',
    price: 2800,
    condition: 'Good',
    location: 'Nakuru',
    image: 'https://images.unsplash.com/photo-1705113998946-1eefc7961c24?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z2FyZGVuaW5nJTIwdG9vbHMlMjBzZXR8ZW58MHx8MHx8fDA%3D',
    tags: ['gardening', 'tools', 'outdoor', 'home'],
    specifications: {
      'Pieces': '8 tools',
      'Includes': 'Trowel, Rake, Shears, etc.',
      'Storage Bag': 'Yes'
    }
  }
];

async function seedDatabase() {
    try {
      // Connect to MongoDB (use .env or fallback to hardcoded URI)
      const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://juliusmuthoni22_db_user:vmX9mZibMqTXSkqR@cluster0.qaaybno.mongodb.net/decluttr';
      console.log('🔌 Connecting to MongoDB...');
  
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to MongoDB');
  
      // Clear existing products
      await Product.deleteMany({});
      console.log('🗑️  Cleared existing products');
  
      // Find a seller user (you might need to create one first)
      let seller = await User.findOne({ username: 'demo_user' });
      
      // If no demo user exists, create one
      if (!seller) {
        seller = await User.create({
          name: 'Demo User',
          username: 'demo_user',
          email: 'demo@decluttr.com',
          password: 'demo123',
          phoneNumber: '0712345678',
          location: 'Nairobi',
          role: 'user'
        });
        console.log('✅ Created demo user');
      } else {
        console.log('✅ Found existing demo user');
      }
  
      // Prepare products with seller ID
      const productsWithSeller = mockProducts.map(product => ({
        ...product,
        seller: seller._id,
        isVerified: true,
        status: 'available',
        views: Math.floor(Math.random() * 100) + 1,
        images: [{
          public_id: `product_${Math.random().toString(36).substr(2, 9)}`,
          url: product.image
        }]
      }));
  
      // Insert products
      const insertedProducts = await Product.insertMany(productsWithSeller);
      console.log(`✅ Successfully seeded ${insertedProducts.length} products`);
  
      // Show summary
      console.log('\n📦 Seeded Products Summary:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Group by category
      const categories = {};
      insertedProducts.forEach(product => {
        if (!categories[product.category]) {
          categories[product.category] = [];
        }
        categories[product.category].push(product);
      });

      Object.keys(categories).forEach(category => {
        console.log(`\n📂 ${category} (${categories[category].length} items):`);
        categories[category].forEach((product, index) => {
          const priceStr = product.price === 0 ? 'FREE (Donation)' : `KES ${product.price.toLocaleString()}`;
          console.log(`   ${index + 1}. ${product.name} - ${priceStr}`);
        });
      });

      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`\n✨ Total Products: ${insertedProducts.length}`);
      console.log(`💰 Resale Items: ${insertedProducts.filter(p => p.listingType === 'resale').length}`);
      console.log(`🎁 Donation Items: ${insertedProducts.filter(p => p.listingType === 'donation').length}`);
      
      // Calculate statistics
      const totalValue = insertedProducts.reduce((sum, p) => sum + p.price, 0);
      const avgPrice = Math.round(totalValue / insertedProducts.filter(p => p.price > 0).length);
      console.log(`💵 Average Price (resale items): KES ${avgPrice.toLocaleString()}`);
      console.log(`🏷️  Categories: ${Object.keys(categories).length}`);
      console.log(`📍 Locations: ${[...new Set(insertedProducts.map(p => p.location))].join(', ')}`);
  
      // Disconnect from MongoDB
      await mongoose.disconnect();
      console.log('\n✅ Database seeding completed successfully! 🎉\n');
      process.exit(0);
    } catch (error) {
      console.error('\n❌ Error seeding database:', error);
      process.exit(1);
    }
  }

// Run the seed function
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };