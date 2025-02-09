import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from './config/index.js';
import authRoutes from './routes/auth.js';
import crisisRoutes from './routes/crisis.js';
import uploadRoutes from './routes/upload.js';
import path from 'path';

const app = express();

// CORS configuration
app.use(cors({

  origin: ['http://localhost:5173', 'https://community-crisis-full-stack.onrender.com','https://crisisconnected.netlify.app'],

  credentials: true
}));

app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Connect to MongoDB
mongoose.connect(config.db.uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/crisis', crisisRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
