const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const crisisRoutes = require('./routes/crisis');
const uploadRoutes = require('./routes/upload');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/crisis', crisisRoutes);
app.use('/api/upload', uploadRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
