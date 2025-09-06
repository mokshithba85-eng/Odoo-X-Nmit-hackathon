require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../src/models/User');
const Product = require('../src/models/Product');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Eco-friendly product templates
const ecoProducts = [
  { title: 'Reclaimed Wood Dining Table', category: 'Furniture', price: 299.99, description: 'Beautiful reclaimed oak dining table, seats 6 people. Perfect for sustainable living.' },
  { title: 'Organic Cotton T-Shirt', category: 'Clothing', price: 19.99, description: '100% organic cotton t-shirt, fair trade certified. Comfortable and eco-friendly.' },
  { title: 'Solar-Powered Phone Charger', category: 'Electronics', price: 45.00, description: 'Portable solar charger for phones and tablets. Perfect for outdoor adventures.' },
  { title: 'Bamboo Kitchen Utensils Set', category: 'Home & Kitchen', price: 24.99, description: 'Complete set of bamboo cooking utensils. Biodegradable and sustainable.' },
  { title: 'Vintage Leather Jacket', category: 'Clothing', price: 89.99, description: 'Genuine vintage leather jacket, upcycled and restored. Timeless style.' },
  { title: 'Recycled Glass Vases', category: 'Home & Kitchen', price: 34.99, description: 'Set of 3 handcrafted vases made from recycled glass bottles.' },
  { title: 'Compost Bin System', category: 'Home & Kitchen', price: 79.99, description: 'Indoor compost bin with charcoal filters. Reduce food waste at home.' },
  { title: 'Hemp Yoga Mat', category: 'Sports', price: 39.99, description: 'Natural hemp yoga mat, non-toxic and biodegradable. Perfect for mindful practice.' },
  { title: 'Refurbished Laptop', category: 'Electronics', price: 399.99, description: 'Certified refurbished laptop, 8GB RAM, 256GB SSD. Like new condition.' },
  { title: 'Wooden Children\'s Toys', category: 'Toys', price: 29.99, description: 'Handcrafted wooden toy set, made from sustainable timber. Safe for children.' },
  { title: 'Organic Cotton Bedding Set', category: 'Home & Kitchen', price: 69.99, description: 'Complete organic cotton bedding set, hypoallergenic and chemical-free.' },
  { title: 'Bamboo Bike', category: 'Sports', price: 599.99, description: 'Lightweight bamboo bicycle frame, eco-friendly alternative to metal bikes.' },
  { title: 'Recycled Paper Notebooks', category: 'Books', price: 12.99, description: 'Set of 5 notebooks made from 100% recycled paper. Perfect for eco-conscious writers.' },
  { title: 'Vintage Vinyl Records', category: 'Electronics', price: 15.99, description: 'Collection of vintage vinyl records, great for music lovers and collectors.' },
  { title: 'Organic Herbal Tea Set', category: 'Home & Kitchen', price: 22.99, description: 'Assorted organic herbal teas, packaged in biodegradable materials.' },
  { title: 'Upcycled Denim Bag', category: 'Clothing', price: 35.99, description: 'Handmade bag from upcycled denim jeans. Unique and sustainable fashion.' },
  { title: 'Solar Garden Lights', category: 'Home & Kitchen', price: 49.99, description: 'Set of 6 solar-powered garden lights. Illuminate your garden sustainably.' },
  { title: 'Bamboo Cutting Board', category: 'Home & Kitchen', price: 18.99, description: 'Natural bamboo cutting board, antimicrobial and easy to clean.' },
  { title: 'Refurbished Camera', category: 'Electronics', price: 199.99, description: 'Professional refurbished DSLR camera, perfect for photography enthusiasts.' },
  { title: 'Organic Cotton Tote Bags', category: 'Clothing', price: 14.99, description: 'Set of 3 organic cotton tote bags, perfect for grocery shopping.' }
];

async function generateImagePrompt(product) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Generate a detailed image description for an eco-friendly product: "${product.title}". 
    Category: ${product.category}
    Description: ${product.description}
    
    Create a vivid, detailed description of what this product would look like in a high-quality product photo. 
    Focus on the sustainable/eco-friendly aspects, natural materials, and clean, modern presentation. 
    The description should be suitable for generating a product image. Keep it under 200 words.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.log(`Error generating image prompt for ${product.title}:`, error.message);
    return `A beautiful, eco-friendly ${product.title} displayed on a clean, natural background`;
  }
}

async function run() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    console.log('🔄 Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});

    console.log('🔄 Creating users...');
    const alice = await User.create({
      email: 'alice@demo.com',
      username: 'alice',
      passwordHash: await bcrypt.hash('Password123!', 10)
    });
    
    const bob = await User.create({
      email: 'bob@demo.com',
      username: 'bob',
      passwordHash: await bcrypt.hash('Password123!', 10)
    });

    const charlie = await User.create({
      email: 'charlie@demo.com',
      username: 'charlie',
      passwordHash: await bcrypt.hash('Password123!', 10)
    });

    console.log('🔄 Creating 20 eco-friendly products...');
    const users = [alice, bob, charlie];
    const products = [];

    for (let i = 0; i < ecoProducts.length; i++) {
      const productData = ecoProducts[i];
      const owner = users[i % users.length]; // Distribute products among users
      
      console.log(`🔄 Creating product ${i + 1}/20: ${productData.title}`);
      
      // Generate AI image description
      const imageDescription = await generateImagePrompt(productData);
      
      const product = await Product.create({
        ownerId: owner._id,
        title: productData.title,
        category: productData.category,
        price: productData.price,
        description: productData.description,
        imageUrl: `/api/placeholder/${encodeURIComponent(imageDescription)}`, // Placeholder for now
        isActive: true
      });
      
      products.push(product);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('✅ Successfully created:');
    console.log(`   - ${await User.countDocuments()} users`);
    console.log(`   - ${await Product.countDocuments()} products`);
    console.log('🎉 Enhanced seeding completed!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

run();
