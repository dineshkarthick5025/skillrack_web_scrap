// server.js
import app from './src/app.js';
import { config, isValidSkillrackUrl } from './src/config/config.js';
import { fetchProfileData } from './src/services/scraperService.js';

// Get URL from command line argument or prompt
async function main() {
  const url = process.argv[2];

  if (!url) {
    // Server Mode: Start the web server
    app.listen(config.PORT, () => {
      console.log(`\n================================================================`);
      console.log(`SkillRack Profile Scraper server is running on http://localhost:${config.PORT}`);
      console.log(`Open your browser and go to http://localhost:${config.PORT} to use the web interface`);
      console.log(`================================================================\n`);
    });
    return;
  }

  // CLI Mode: Validate URL format
  if (!isValidSkillrackUrl(url)) {
    console.error('Error: Please provide a valid SkillRack profile URL');
    console.error('Example: https://www.skillrack.com/profile/... or https://www.skillrack.com/faces/resume.xhtml?id=...');
    process.exit(1);
  }

  await fetchProfileData(url);
}

// Run the script
main().catch(console.error);
export { fetchProfileData };
