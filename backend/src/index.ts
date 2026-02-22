import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { DB_USER, DB_PASS, PORT } from './config/env';
import noteRoutes from './routes/noteRoutes';
import authRoutes from './routes/authRoutes';



const app = express();

const MONGODB_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.wltwnol.mongodb.net/Notes?appName=Cluster0`;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/test', (_req, res) => {
    res.json({ ok: true });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

export default app;
