# DECLUTTR - Web-based Recommerce and Decluttering Platform

## 🎯 Project Overview

**DECLUTTR** is a secure, user-friendly web platform that enables users to declutter their spaces by selling or donating used items. Built with modern web technologies, it addresses the challenges of unsafe online marketplaces by providing admin verification, secure transactions, and seamless buyer-seller communication.

**Presenter:** Mary Ann Wangechi Koome  
**Institution:** Dedan Kimathi University of Technology  
**Course:** BSc. Computer Science  
**Date:** December 2025

---

## 🚀 Tech Stack

### Frontend
- **Next.js 15+** (App Router with TypeScript)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons


### Backend (Separate Repository)
- **Node.js & Express** - API server
- **PostgreSQL** - Database
- **JWT** - Authentication

---

## 📁 Project Structure

```
decluttr/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group (no navbar)
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   └── signup/
│   │       └── page.tsx         # Signup page
│   │
│   ├── (main)/                   # Main app routes (with navbar)
│   │   ├── layout.tsx           # Layout with navbar
│   │   ├── marketplace/
│   │   │   └── page.tsx         # Main marketplace/landing (after login)
│   │   ├── cart/
│   │   │   └── page.tsx         # Shopping cart
│   │   ├── messages/
│   │   │   └── page.tsx         # Messaging system
│   │   ├── dashboard/
│   │   │   └── page.tsx         # User dashboard (profile)
│   │   ├── list-item/
│   │   │   └── page.tsx         # Add/list products
│   │   ├── checkout/
│   │   │   └── page.tsx         # Payment page
│   │   └── admin/
│   │       └── page.tsx         # Admin dashboard
│   │
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home/landing page (unauthenticated)
│   └── globals.css              # Global styles
│
├── components/                   # Reusable components
│   ├── ui/                      # UI primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── dialog.tsx
│   ├── navbar.tsx               # Main navigation
│   ├── product-card.tsx         # Product display card
│   ├── search-bar.tsx           # Search component
│   ├── category-filter.tsx      # Category filtering
│   └── chat-interface.tsx       # Messaging UI
│
├── lib/                         # Utility functions
│   ├── api.ts                   # API calls
│   ├── utils.ts                 # Helper functions
│   └── validators.ts            # Zod schemas
│
├── types/                       # TypeScript types
│   └── index.ts                 # Type definitions
│
├── public/                      # Static assets
│   ├── favicon.ico
│   ├── logo.svg
│   └── images/
│
├── hooks/                       # Custom React hooks
│   ├── use-auth.ts
│   └── use-cart.ts
│
└── package.json
```

---

## 🎨 Page Flow & Features

### 1. **Home Page** (`/`)
- **Route:** `app/page.tsx`
- **Access:** Public (no login required)
- **Features:**
  - Hero section with "Get Started" CTA
  - Search bar (redirects to marketplace with search results)
  - Login button → `/login`
  - Clean, welcoming design with animations

### 2. **Login Page** (`/login`)
- **Route:** `app/(auth)/login/page.tsx`
- **Access:** Public
- **Features:**
  - Email/Username + Password fields
  - Form validation
  - Redirect to `/marketplace` on success
  - "Don't have an account?" link → `/signup`

### 3. **Signup Page** (`/signup`)
- **Route:** `app/(auth)/signup/page.tsx`
- **Access:** Public
- **Features:**
  - Fields: Name, Username, Email, Password, Confirm Password, Location (dropdown), Phone Number
  - Form validation (passwords must match)
  - Redirect to `/login` after successful signup
  - "Already have an account?" link → `/login`

### 4. **Marketplace** (`/marketplace`)
- **Route:** `app/(main)/marketplace/page.tsx`
- **Access:** Authenticated users (main hub after login)
- **Features:**
  - **Navbar:** Search, Home, Messages, Cart, My Profile, Logout
  - **Category tabs:** Books, Electronics, Shoes, Clothes, Furniture, All Products
  - **Filter:** All, Resale Only, Donation Only
  - **Product grid:** 2 rows × 3 columns with pagination (Prev/Next)
  - **Product Card:** Image, Name, Seller Username, Type (Resale/Donation), Price, "Add to Cart" button
  - If accessed via search (without login) → prompt to login

### 5. **Cart Page** (`/cart`)
- **Route:** `app/(main)/cart/page.tsx`
- **Access:** Authenticated users
- **Features:**
  - List of added items (image, name, seller, type, price)
  - Shipping address (default: signup location, editable dropdown)
  - Shipping fee: KSh 600 (default)
  - Grand Total = Item Total + Shipping
  - "Proceed to Checkout" button → `/checkout`

### 6. **Checkout/Payment** (`/checkout`)
- **Route:** `app/(main)/checkout/page.tsx`
- **Access:** Authenticated users
- **Features:**
  - M-Pesa number input (pre-filled with signup phone)
  - Amount (auto-filled from cart)
  - "Proceed to Pay" button triggers M-Pesa STK push

### 7. **Messages** (`/messages`)
- **Route:** `app/(main)/messages/page.tsx`
- **Access:** Authenticated users
- **Features:**
  - **Two-column layout:**
    - Left: Recent chats list
    - Right: Active conversation with timestamps
  - Message input at bottom
  - Real-time updates (future: WebSocket)

### 8. **List Item Page** (`/list-item`)
- **Route:** `app/(main)/list-item/page.tsx`
- **Access:** Authenticated users
- **Features:**
  - **Two-column layout:**
    - Left sidebar: User info, "Add Products", "Messages", "Logout"
    - Right: Form to list item
  - **Form fields:**
    - Category (dropdown: 5 categories)
    - Product Name
    - Description
    - Image Upload (multiple images)
    - Listing Type (Resale/Donation)
    - Price (if Resale)
  - "Add Product" button saves item

### 9. **User Dashboard** (`/profile`)
- **Route:** `app/(main)/profile/page.tsx`
- **Access:** Authenticated users
- **Features:**
  - **Two-column layout:**
    - Left: User details sidebar (Name, Email, Location, buttons)
    - Right: 3 sections
      1. **Stats cards:** Total Income (KSh), Total Exchanges, User Ratings
      2. **Listed Items table:** Name, Photo, Category, Type, Price, Order Status
      3. **Recent Orders table:** Name, Category, Type, Receiver, Status

### 10. **Admin Dashboard** (`/admin`)
- **Route:** `app/(main)/admin/page.tsx`
- **Access:** Admin users only
- **Features:**
  - **Two-column layout:**
    - Left: Admin info sidebar
    - Right: 3 sections
      1. **Stats cards:** Total Exchanges, Pending Orders, Pending Deliveries
      2. **Recent Orders table:** Name, Category, Type, Seller, Receiver, Status, Order Details
  - Admin verification and moderation tools

---

## 🔐 Authentication Flow

1. **Unauthenticated users:**
   - Can view home page (`/`)
   - Can search (results show in marketplace, but must login to add to cart)
   - Redirected to `/login` when accessing protected routes

2. **Authenticated users:**
   - Full access to marketplace, cart, messages, dashboard, list-item
   - Navbar persists across all main routes
   - Session managed via JWT tokens

3. **Admin users:**
   - All user permissions + access to `/admin` dashboard

---

## 🎯 Key Features

### ✅ User Features
- **Secure Registration & Login** with validation
- **Product Listing** with images, categories, resale/donation options
- **Search & Filter** by category and listing type
- **Shopping Cart** with dynamic total calculation
- **M-Pesa Integration** for secure payments
- **Real-time Messaging** between buyers and sellers
- **User Dashboard** with sales analytics and order tracking

### ✅ Admin Features
- **Admin Dashboard** with platform-wide analytics
- **Product Verification** before listings go live
- **Order Moderation** and status tracking
- **User Management**

### ✅ Design Features
- **Responsive Design** - Works on mobile, tablet, desktop
- **Smooth Animations** - Framer Motion page transitions and interactions
- **Modern UI** - Clean, intuitive interface with Tailwind CSS
- **Icon System** - Lucide React for consistent, beautiful icons
- **Dark/Light Mode** - User preference support (optional)

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm/yarn/pnpm package manager
- Backend API running (separate repository)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd decluttr

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Add your environment variables
# NEXT_PUBLIC_API_URL=http://localhost:5000
# NEXT_PUBLIC_MPESA_CONSUMER_KEY=your_key
# NEXT_PUBLIC_MPESA_CONSUMER_SECRET=your_secret

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.460.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "axios": "^1.6.0",
    "zustand": "^4.4.0"
  }
}
```

---

## 🎨 Design Principles

### Color Scheme (Suggestion)
- **Primary:** Emerald/Green (sustainability, fresh start)
- **Secondary:** Blue (trust, security)
- **Accent:** Orange (call-to-action)
- **Neutral:** Gray scale

### Typography
- **Headings:** Bold, modern sans-serif
- **Body:** Clean, readable sans-serif
- **Code/Numbers:** Monospace

### Components Philosophy
- **Minimal but functional** - No over-engineering
- **Reusable UI components** - Button, Input, Card, etc.
- **Consistent spacing** - Tailwind's spacing scale
- **Accessible** - Proper ARIA labels and keyboard navigation

---

## 🔄 API Integration Points

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Fetch all products (with filters)
- `GET /api/products/:id` - Fetch single product
- `POST /api/products` - Create product listing
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:itemId` - Remove item from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details

### Messages
- `GET /api/messages` - Get user's conversations
- `POST /api/messages` - Send message
- `GET /api/messages/:conversationId` - Get specific conversation

### Payments
- `POST /api/payments/mpesa` - Initiate M-Pesa payment
- `POST /api/payments/callback` - M-Pesa callback

---

## 📱 Responsive Breakpoints

```css
/* Tailwind CSS breakpoints */
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large
```

---

## 🚧 Future Enhancements

- [ ] WebSocket integration for real-time messaging
- [ ] Push notifications for new messages/orders
- [ ] Advanced search with autocomplete
- [ ] Product reviews and ratings
- [ ] Favorites/Wishlist feature
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Progressive Web App (PWA)

---

## 👥 User Roles

### Regular User
- Browse products
- List items
- Buy items
- Message sellers
- Manage orders

### Admin
- All user permissions
- Verify product listings
- Moderate content
- View platform analytics
- Manage users

---

