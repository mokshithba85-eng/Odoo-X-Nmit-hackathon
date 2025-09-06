require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Product = require('../src/models/Product');

async function run(){
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await Product.deleteMany({});

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

  await Product.create([
    { ownerId: alice._id, title: 'Reclaimed Wood Desk', category: 'Furniture', price: 129.99, description: 'Upcycled desk in great condition.' },
    { ownerId: bob._id, title: 'Organic Cotton Hoodie', category: 'Clothing', price: 24.50, description: 'Lightly used hoodie.' },
    { ownerId: alice._id, title: 'Refurbished Phone', category: 'Electronics', price: 199, description: 'Certified refurb, 64GB.' }
  ]);

  console.log('Seeded.');
  process.exit(0);
}
run().catch(err => { console.error(err); process.exit(1); });
