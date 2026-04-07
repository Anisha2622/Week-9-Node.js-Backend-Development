const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Route & Middleware Imports
const postRoutes = require('./src/routes/postRoutes');
const errorHandler = require('./src/middleware/errorhandler');

const app = express();

// 1. Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 2. Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==========================================
// 3. AUTHENTICATION (Simulated Database)
// ==========================================
const users = []; // In-memory user store

// Register Endpoint
app.post('/api/auth/register', (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      const error = new Error('Username and password are required');
      error.statusCode = 400;
      throw error;
    }

    if (users.find(u => u.username === username)) {
      const error = new Error('Username already exists');
      error.statusCode = 400;
      throw error;
    }

    const newUser = { id: Date.now(), username, password };
    users.push(newUser);
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
});

// Login Endpoint (Generates JWT)
app.post('/api/auth/login', (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '2h' }
    );
    
    res.json({ success: true, message: 'Login successful', token });
  } catch (error) {
    next(error);
  }
});

// 4. API Routes
app.use('/api/posts', postRoutes);

// 5. 404 Fallback Route
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// 6. Global Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});