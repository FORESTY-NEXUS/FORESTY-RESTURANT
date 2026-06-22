const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const http = require('http');
const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');
const socketHandler = require('./socket');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = socketHandler.init(server);
app.set('io', io); // Make io accessible via req.app.get('io')

// Body parser with payload limits
app.use(express.json());

// Enable CORS
app.use(cors({ origin: '*' }));

// Apply rate limiting (commented out for debugging)
// app.use('/api', apiLimiter);

// Root route
app.get('/', (req, res) => {
  res.send('Foresty Restaurant API is running...');
});

// Import routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/delivery', require('./routes/delivery'));
app.use('/api/otp', require('./routes/otp'));
// We will create these shortly
app.use('/api/users', require('./routes/users'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/upload', require('./routes/upload'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
