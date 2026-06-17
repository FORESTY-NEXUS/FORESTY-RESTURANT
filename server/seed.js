const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const MenuItem = require('./models/MenuItem');

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@foresty.com',
    password: 'admin123',
    role: 'admin',
    phone: '+923000000001'
  },
  {
    name: 'Delivery Agent',
    email: 'delivery@foresty.com',
    password: 'delivery123',
    role: 'delivery',
    phone: '+923000000002'
  }
];

const menuItems = [
  { name: 'Zilla Cheese Burger', description: 'Double smashed patty, signature cheese sauce, caramelized onions', price: 1299, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800', images: [], stock: -1, tags: ['Bestseller'] },
  { name: 'Inferno Stack Burger', description: 'Triple stack with jalapeños, pepper jack, spicy mayo', price: 1599, category: 'Burgers', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800', images: [], stock: 50, tags: ['Spicy'] },
  { name: 'Lava Chicken Pizza', description: 'Grilled chicken, mozzarella volcano, red chili flakes', price: 2499, category: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800', images: [], stock: -1, tags: ['Trending'] }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await User.deleteMany();
    await MenuItem.deleteMany();

    await User.create(users);
    await MenuItem.create(menuItems);

    console.log('✅ Data Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error(`❌ Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
