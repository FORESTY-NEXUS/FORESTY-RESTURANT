const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const http = require('http');
const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');
const socketHandler = require('./socket');

dotenv.config({ path: path.join(__dirname, '.env') });

connectDB();

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));

// app.use('/api', apiLimiter);

app.get('/', (req, res) => {
  res.send('Foresty Restaurant API is running...');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/delivery', require('./routes/delivery'));
app.use('/api/otp', require('./routes/otp'));
app.use('/api/users', require('./routes/users'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/upload', require('./routes/upload'));

if (!process.env.VERCEL) {
  const server = http.createServer(app);
  const io = socketHandler.init(server);
  app.set('io', io);

  const PORT = process.env.PORT || 5000;

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
