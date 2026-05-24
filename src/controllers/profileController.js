// src/controllers/profileController.js
import { fetchProfileData } from '../services/scraperService.js';
import { isValidSkillrackUrl } from '../config/config.js';

/**
 * Handles the HTTP POST request to fetch a SkillRack profile.
 * Route: POST /api/fetch-profile
 * Body: { url: string }
 */
export async function getProfile(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!isValidSkillrackUrl(url)) {
      return res.status(400).json({ error: 'Invalid SkillRack profile URL' });
    }

    const data = await fetchProfileData(url);

    if (!data) {
      return res.status(500).json({ error: 'Failed to fetch profile data' });
    }

    // Keep response structure exactly matching original:
    // Adding rollNumber and yearInfo explicitly if necessary, though it's already in data.
    const responseData = {
      ...data,
      rollNumber: data.rollNumber,
      yearInfo: data.yearInfo
    };

    return res.json(responseData);
  } catch (error) {
    console.error('API Controller Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
