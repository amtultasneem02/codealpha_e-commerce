# AeroShop - Modern Full-Stack E-commerce Store

A premium, fully functional e-commerce application built with **React** (Vite), **Express.js**, and **MongoDB**. 
Featuring an ultra-sleek, responsive layout utilizing vanilla CSS, glassmorphism UI components, JWT user authentication, shopping cart state management, and real-time database order checking.

---

## Technical Stack & Architecture

- **Frontend**: React.js, React Router v6, Lucide Icons
- **Backend**: Node.js, Express.js REST API, JWT Authentication
- **Database**: MongoDB (via Mongoose schemas)
- **Styling**: Pure CSS (Plus Jakarta Sans font, slate dark mode, custom animation curves)
- **Tooling**: Vite bundler, proxy configuration

---

## Features

1. **Product Listings**: Category sorting ("All", "Electronics", "Accessories"), real-time search filtering, price/rating ordering.
2. **Product Details**: Inventory status warnings, specs breakdown, stock quantity limits, and direct shopping cart additions.
3. **Interactive Shopping Cart**: Quantity modifications, subtotal/tax calculations, and local storage state persistence.
4. **JWT User Authentication**: Encrypted password storage, user login, registration verification, and session state tracking.
5. **Checkout & Order Processing**: Multi-phase flow (shipping inputs, simulated billing validations, review summaries) with stock count depletion updates in MongoDB.
6. **Order History**: User profile records showing a structured table of past transactions with expandible item details.

---

## Directory Layout

```
ecommerce-store/
├── package.json           # Workspace manager configuring concurrent dev servers
├── README.md              # Setup guide
├── client/                # Vite React App
│   ├── index.html         # HTML entry (includes Favicon SVG)
│   ├── package.json       # React dependencies
│   ├── vite.config.js     # React dev proxy setting
│   └── src/
│       ├── main.jsx       # App mount
│       ├── App.jsx        # Routing configuration
│       ├── index.css      # Core Design System
│       ├── components/    # Reusable widgets
│       ├── context/       # Auth/Cart states
│       └── pages/         # High-level route views
└── server/                # Node Express App
    ├── server.js          # App loader
    ├── config/            # DB hooks
    ├── middleware/        # Authorization middlewares
    ├── controllers/       # Route action logic
    ├── routes/            # REST API mappings
    ├── models/            # MongoDB Mongoose schemas
    └── scripts/           # Database seed script
```

---

## Getting Started

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MongoDB** (Ensure you have a MongoDB instance running locally on `mongodb://localhost:27017/ecommerce`, or use a remote connection string)

### 2. Environment Configuration
Configure environment parameters in `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=secretkey123
```

### 3. Installation
Install all dependencies for both backend and frontend by running the setup script from the root project directory:
```bash
npm run setup
```

### 4. Seed Database
Run the seeder script to populate your MongoDB database with modern gadgets and default testing accounts:
```bash
npm run seed
```

### 5. Start Development Servers
Start both the React client and Express server concurrently:
```bash
npm run dev
```
- **React Frontend**: `http://localhost:3000`
- **Express Backend**: `http://localhost:5000`

---

## Test Accounts

You can log in to the application using these seeded accounts:

### 1. Standard Customer
- **Email**: `john@example.com`
- **Password**: `password123`

### 2. Administrator
- **Email**: `admin@example.com`
- **Password**: `password123`

---

## REST API Documentation

### Products
- `GET /api/products` - Retrieve list of products (supports query parameters: `keyword`, `category`, `sort`)
- `GET /api/products/:id` - Get details of a single product

### Users
- `POST /api/users` - Register a new user profile
- `POST /api/users/login` - Authenticate user & retrieve JWT token
- `GET /api/users/profile` - Retrieve logged-in user profile (Requires Authorization: Bearer JWT)

### Orders
- `POST /api/orders` - Place a new order (Requires Authorization: Bearer JWT)
- `GET /api/orders/myorders` - Get current user's order history (Requires Authorization: Bearer JWT)
- `GET /api/orders/:id` - Get single order details (Requires Authorization: Bearer JWT)
