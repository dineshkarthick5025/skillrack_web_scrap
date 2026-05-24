// src/config/config.js

export const config = {
  PORT: process.env.PORT || 3000,
  SCRAPER: {
    timeout: 10000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  }
};

/**
 * Validates whether the given URL is a valid SkillRack profile URL.
 * @param {string} url - The URL to validate.
 * @returns {boolean}
 */
export function isValidSkillrackUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const isDomainOk = parsed.hostname.includes('skillrack.com');
    const isPathOk = parsed.pathname.includes('profile') || parsed.search.includes('id=');
    return isDomainOk && isPathOk;
  } catch (e) {
    return false;
  }
}
