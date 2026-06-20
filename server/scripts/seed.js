import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

connectDB();

const products = [
  {
    name: 'AeroBook Pro 15',
    image: 'https://images.unsplash.com/photo-1496181130207-81916aba01ef?w=600&auto=format&fit=crop&q=60',
    brand: 'Aero',
    category: 'Electronics',
    description: 'A sleek, lightweight laptop with a powerful processor, 16GB RAM, and 512GB SSD. Features a gorgeous 15.6-inch retina-grade screen.',
    price: 119999.00,
    countInStock: 8,
    rating: 4.8,
    numReviews: 12,
  },
  {
    name: 'SoundWave ANC Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60',
    brand: 'SoundWave',
    category: 'Electronics',
    description: 'Immerse yourself in music with industry-leading Active Noise Cancellation (ANC), 40-hour battery life, and crystal-clear acoustic fidelity.',
    price: 19999.00,
    countInStock: 15,
    rating: 4.6,
    numReviews: 28,
  },
  {
    name: 'Quantum Phone X',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=60',
    brand: 'Quantum',
    category: 'Electronics',
    description: 'Supercharge your daily routine with the ultimate dynamic display, an integrated 108MP triple camera system, and ultra-fast 5G connectivity.',
    price: 79999.00,
    countInStock: 12,
    rating: 4.7,
    numReviews: 19,
  },
  {
    name: 'Apex Mechanical Keyboard',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=60',
    brand: 'Apex',
    category: 'Accessories',
    description: 'Engineered for speed, customization, and ergonomic typing support. Features tactile mechanical brown switches and customizable RGB lighting backplate.',
    price: 9999.00,
    countInStock: 25,
    rating: 4.5,
    numReviews: 44,
  },
  {
    name: 'Chronos Smartwatch v3',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60',
    brand: 'Chronos',
    category: 'Accessories',
    description: 'Track your health metrics, receive immediate alerts, and schedule your calendar directly from your wrist. Features premium titanium mesh styling.',
    price: 15999.00,
    countInStock: 0,
    rating: 4.2,
    numReviews: 7,
  },
  {
    name: 'UltraWide Curved Monitor 34"',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=60',
    brand: 'Horizon',
    category: 'Electronics',
    description: 'Expand your virtual workspace or gaming battlefield with a breathtaking 34-inch panoramic curved display, running at a buttery-smooth 144Hz refresh rate.',
    price: 39999.00,
    countInStock: 5,
    rating: 4.9,
    numReviews: 31,
  }
];

const seedData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    // Create a default admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      isAdmin: true,
    });

    // Create a default customer user
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      isAdmin: false,
    });

    console.log('Test users created!');

    await Product.insertMany(products);

    console.log('Products Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
