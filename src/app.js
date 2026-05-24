// src/app.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import profileRoutes from './routes/profileRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files from 'public' directory at root
app.use(express.static(path.join(__dirname, '../public')));

// Mount API routes under /api
app.use('/api', profileRoutes);

// Route to serve dashboard UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

export default app;
