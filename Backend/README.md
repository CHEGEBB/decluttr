# Decluttr Backend API

A Node.js/Express backend for a marketplace platform where users can list items for resale or donation, manage orders, process M-Pesa payments, and communicate with each other.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
- [Authentication & Authorization](#authentication--authorization)
- [Payment Integration](#payment-integration)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Security](#security)
- [Deployment](#deployment)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Payment Gateway**: M-Pesa (Safaricom)
- **Password Hashing**: bcryptjs

## Project Structure

```
Backend/
└── src/
    ├── config/           # Configuration files
    │   ├── cloudinary.js     # Cloudinary setup for image uploads
    │   ├── database.js       # MongoDB connection
    │   └── mpesa.js          # M-Pesa integration config
    │
    ├── controllers/      # Business logic
    │   ├── adminController.js    # Admin dashboard & management
    │   ├── authController.js     # User authentication
    │   ├── cartController.js     # Shopping cart operations
    │   ├── messageController.js  # User messaging system
    │   ├── orderController.js    # Order management
    │   ├── paymentController.js  # M-Pesa payment processing
    │   ├── productController.js  # Product CRUD operations
    │   └── userController.js     # User profile & dashboard
    │
    ├── middleware/       # Express middleware
    │   ├── auth.js           # JWT authentication & role-based access
    │   └── upload.js         # File upload configuration (Multer)
    │
    ├── models/           # Database schemas
    │   ├── Cart.js           # Shopping cart schema
    │   ├── Message.js        # Messaging schema
    │   ├── Order.js          # Order & payment tracking
    │   ├── Product.js        # Product listings
    │   ├── Transaction.js    # Payment transactions
    │   └── User.js           # User accounts
    │
    ├── routes/           # API route definitions
    │   ├── adminRoutes.js
    │   ├── authRoutes.js
    │   ├── cartRoutes.js
    │   ├── messageRoutes.js
    │   ├── orderRoutes.js
    │   ├── paymentRoutes.js
    │   ├── productRoutes.js
    │   └── userRoutes.js
    │
    ├── utils/            # Helper functions
    │   └── tokenGenerator.js # JWT token generation
    │
    └── server.js         # Application entry point
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
BASE_URL=https://your-domain.com

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/decluttr

# JWT Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# M-Pesa Payment Gateway
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey
MPESA_ENV=sandbox  # or 'production'

# Frontend (for CORS)
FRONTEND_URL=http://localhost:3000
```

## Database Models

### User
- **Basic info**: name, username, email, password (hashed), phoneNumber, location
- **Role**: `user` or `admin`
- **Stats**: totalIncome, totalExchanges, ratings
- **Status**: isActive (for account deactivation)
- **Security**: Automatic password hashing, JWT token methods

### Product
- **Details**: name, description, category, images (Cloudinary)
- **Type**: `resale` (with price) or `donation` (free)
- **Categories**: Books, Electronics, Shoes, Clothes, Furniture
- **Status**: `available`, `pending`, `sold`
- **Verification**: isVerified (admin approval required)
- **Reference**: seller (User)

### Cart
- One cart per user (unique constraint)
- Items: array of product references
- Prevents duplicates automatically
- Maintains addition timestamps

### Order
- Buyer reference
- Items: array with product, seller, price, listing type
- Shipping: address, shippingFee (default 600)
- Payment: embedded payment schema with M-Pesa details
- Status tracking: orderStatus, paymentStatus
- Comprehensive indexes for performance

### Message
- Conversation system between users
- Automatic conversation ID generation
- Read receipts functionality
- Product context in messages
- Efficient querying with indexes

### Transaction
- Payment transaction logging
- M-Pesa receipt tracking
- Status history: initiated, pending, completed, failed, cancelled

## API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Register new user with validation
- `POST /login` - Authenticate user (email/username + password)
- `GET /me` - Get current authenticated user profile
- `POST /logout` - Logout user (client-side token removal)

### Users (`/api/users`)
- `GET /dashboard` - User dashboard with stats, products, and recent orders
- `GET /me/profile` - Get authenticated user's full profile
- `PUT /me/profile` - Update user profile (name, location, bio)
- `GET /profile/:username` - Get public profile by username

### Products (`/api/products`)
- `GET /` - Get all products with filtering, pagination, and search
- `GET /:id` - Get specific product by ID (increments views)
- `POST /` - Create new product (requires images, admin verification)
- `PUT /:id` - Update product (owner only)
- `DELETE /:id` - Delete product (owner only, removes Cloudinary images)
- `GET /my/products` - Get authenticated user's products

### Cart (`/api/cart`)
- `GET /` - Get user's cart with calculated totals
- `POST /add` - Add product to cart (validates availability)
- `DELETE /remove/:productId` - Remove product from cart
- `DELETE /clear` - Clear entire cart

### Orders (`/api/orders`)
- `POST /` - Create order from cart (with shipping address)
- `GET /` - Get authenticated user's orders
- `GET /received` - Get orders received (for sellers)
- `GET /:id` - Get specific order details
- `PUT /:id/status` - Update order status (seller or admin)

### Messages (`/api/messages`)
- `GET /conversations` - Get all user conversations
- `GET /conversation/:userId` - Get conversation with specific user
- `POST /send` - Send message to user
- `PUT /:conversationId/read` - Mark conversation messages as read

### Payments (`/api/payments`)
- `POST /initiate` - Initiate M-Pesa STK Push payment
- `POST /callback` - M-Pesa payment callback endpoint
- `POST /status` - Query payment status by order ID
- `GET /status/:orderId` - Get payment status by order ID

### Admin (`/api/admin`)
- `GET /dashboard` - Admin dashboard with system statistics
- `GET /products/pending` - Get products awaiting verification
- `PUT /products/:id/verify` - Verify product for public listing
- `DELETE /products/:id` - Delete any product
- `GET /users` - Get all users in system
- `DELETE /users/:id` - Deactivate user account
- `GET /orders` - Get all orders in system

## Authentication & Authorization

### JWT Authentication
- Token-based authentication with Bearer tokens
- Token expiration configurable (default 7 days)
- Automatic token validation middleware
- Role-based access control (RBAC)

### Middleware
- `protect` - Verifies JWT token and attaches user to request
- `isAdmin` - Restricts access to admin users only
- `authorize(...roles)` - Flexible role-based authorization

### Security Features
- Password hashing with bcryptjs
- Rate limiting ready (can be added)
- Input validation and sanitization
- CORS configuration
- Error handling without sensitive data exposure

## Payment Integration

### M-Pesa Integration
- **STK Push**: Mobile payment initiation
- **Callback Handling**: Real-time payment confirmation
- **Status Querying**: Payment status verification
- **Environment Support**: Sandbox and production modes

### Payment Flow
1. User initiates payment with phone number
2. System generates STK Push request to M-Pesa
3. User approves payment on their phone
4. M-Pesa sends callback to our system
5. System updates order and payment status
6. Payment status can be queried if needed

### Features
- Phone number formatting (254XXXXXXXXX)
- Secure password generation for each transaction
- Payment status tracking (pending, completed, failed, cancelled)
- Transaction logging for auditing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account (for image storage)
- M-Pesa API credentials (for payment processing)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your actual credentials
```

4. Start the development server:
```bash
npm run dev
```

The server will start at `http://localhost:5000`

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Build (if needed)
```bash
npm run build
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Request/Response Format
- All requests should include `Content-Type: application/json`
- All responses include `success` boolean and `message` string
- Data is returned in the `data` field for successful responses
- Errors include error details in `error` field

### Example Request
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier": "user@example.com", "password": "password123"}'
```

### Example Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "username": "johndoe",
      "email": "user@example.com",
      "phoneNumber": "254712345678",
      "location": "Nairobi",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Features

### Core Features
1. **User Management**: Registration, authentication, profile management
2. **Product Listings**: Create, read, update, delete products with images
3. **Shopping Cart**: Add, remove, and manage cart items
4. **Order Processing**: Complete order lifecycle management
5. **Payment Processing**: M-Pesa integration for mobile payments
6. **Messaging System**: Real-time communication between users
7. **Admin Dashboard**: Comprehensive admin interface

### Advanced Features
- **Product Verification**: Admin approval system for listings
- **Shipping Calculation**: Automatic shipping fee inclusion
- **Rating System**: User rating and reputation tracking
- **Search & Filtering**: Advanced product search with filters
- **Pagination**: Efficient data loading for large datasets
- **Image Optimization**: Cloudinary integration for image management

## Security

### Implemented Security Measures
- JWT-based authentication with expiration
- Password hashing using bcryptjs
- Input validation and sanitization
- CORS configuration for frontend access
- Environment variable management
- Error handling without sensitive information leakage

### Security Best Practices
- Never store sensitive data in code
- Use environment variables for all secrets
- Implement rate limiting in production
- Regular dependency updates
- Database connection pooling
- Secure headers implementation

## Deployment

### Preparation
1. Update `.env` with production values
2. Set `NODE_ENV=production`
3. Configure proper CORS origins
4. Set up MongoDB Atlas production database
5. Configure Cloudinary production account
6. Switch M-Pesa to production environment

### Deployment Platforms
- **Heroku**: Easy Node.js deployment
- **AWS Elastic Beanstalk**: Scalable AWS deployment
- **DigitalOcean App Platform**: Simple app deployment
- **Railway**: Modern deployment platform

### Production Checklist
- [ ] Enable CORS for production frontend URL
- [ ] Set up MongoDB Atlas production cluster
- [ ] Configure Cloudinary production settings
- [ ] Switch M-Pesa to production mode
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Set up monitoring and alerting
- [ ] Configure SSL certificates
- [ ] Implement backup strategy

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MONGODB_URI in .env
   - Verify network connectivity to MongoDB Atlas
   - Check if IP is whitelisted in MongoDB Atlas

2. **Image Upload Failing**
   - Verify Cloudinary credentials
   - Check file size (max 5MB)
   - Ensure file type is supported (jpg, png, gif, webp)

3. **M-Pesa Payment Issues**
   - Verify M-Pesa credentials
   - Check if phone number format is correct
   - Ensure BASE_URL is accessible for callbacks

4. **JWT Authentication Issues**
   - Check JWT_SECRET in .env
   - Verify token is being sent in Authorization header
   - Ensure token hasn't expired

### Logging
The application includes console logging for development. For production, consider integrating with:
- Winston for advanced logging
- Sentry for error tracking
- CloudWatch for AWS deployments

## Support

For issues and feature requests:
1. Check the troubleshooting section
2. Review API documentation
3. Contact the development team

## License

[Add your license information here]

---

**Note**: This is a backend API only. You'll need a frontend application to interact with these endpoints. The API is designed to work with any modern frontend framework (React, Vue, Angular, etc.).