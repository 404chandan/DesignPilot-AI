require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const generateRoutes = require('./routes/generateRoutes');
const blueprintRoutes = require('./routes/blueprintRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/generate-architecture', generateRoutes);
app.use('/api/blueprints', blueprintRoutes);

const { MongoMemoryServer } = require('mongodb-memory-server');

// Connect to MongoDB with Fallback
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(async (err) => {
    console.error('Error connecting to Atlas (Network Issue):', err.message);
    console.log('Falling back to local in-memory MongoDB for testing...');
    
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      await mongoose.connect(mongoUri);
      console.log('Connected to In-Memory MongoDB Fallback');
      
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} (Using In-Memory DB)`);
      });
    } catch (fallbackErr) {
      console.error('Failed to start in-memory DB:', fallbackErr);
    }
  });
