// src/routes/profileRoutes.js
import { Router } from 'express';
import { getProfile } from '../controllers/profileController.js';

const router = Router();

// Define profile fetching route
router.post('/fetch-profile', getProfile);

export default router;
