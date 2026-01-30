// server.js
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/fetch-profile', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!url.includes('skillrack.com') || !url.includes('profile')) {
      return res.status(400).json({ error: 'Invalid SkillRack profile URL' });
    }

    const data = await fetchData(url);

    if (!data) {
      return res.status(500).json({ error: 'Failed to fetch profile data' });
    }

    // Add additional fields for the API response
    const responseData = {
      ...data,
      rollNumber: data.rollNumber,
      yearInfo: data.yearInfo
    };

    res.json(responseData);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function fetchData(url) {
  try {
    console.log('Fetching data from URL:', url);
    // Extract the resume id from the URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const id = pathParts[2]; // ID is the third part in /profile/ID/...
    console.log('Extracted ID:', id);

    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(data);

    console.log('Page HTML length:', data.length);
    console.log('First 1000 characters of HTML:', data.substring(0, 1000));

    // Extract data from the page
    const rawText = $('div.ui.four.wide.center.aligned.column').text().trim().split('\n');
    console.log('Raw text array:', rawText);
    const name = rawText[0]?.trim() || 'Not found';
    const rollNumber = rawText[2]?.trim() || 'Not found';
    const dept = rawText[4]?.trim() || 'Not found';
    const college = rawText[6]?.trim() || 'Not found';
    const yearInfo = rawText[8]?.trim() || 'Not found';
    const yearMatch = yearInfo.match(/\d{4}$/);
    const year = yearMatch ? yearMatch[0] : 'Not found';
    const codeTutor = parseInt($('div:contains("DT")').next().find('.value').text().trim()) || 0;
    const codeTrack = parseInt($('div:contains("CODE TEST")').next().find('.value').text().trim()) || 0;
    const codeTest = parseInt($('div:contains("PROGRAMS SOLVED")').next().find('.value').text().trim()) || 0;
    const dt = parseInt($('div:contains("DC")').next().find('.value').text().trim()) || 0;
    const dc = parseInt($('div:contains("CODE TRACK")').next().find('.value').text().trim()) || 0;

    // Calculate points
    const points = codeTrack * 2 + codeTest * 30 + dt * 20 + dc * 2;

    // Total Solved = Daily Challenge (dt) + Daily Test (codeTutor) + Code Track (dc) + Code Test (codeTrack) + Code Tutor (codeTest/Programs Solved)
    const totalSolved = dt + codeTutor + dc + codeTrack + codeTest;

    // Format last fetched date
    const date = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });
    const lastFetched = date.split(',')[1].trim();

    // Generate HTML content
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SkillRack Profile - ${name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .profile { max-width: 800px; margin: 0 auto; }
        .section { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        h1 { color: #333; }
        .data-item { margin: 10px 0; }
        .label { font-weight: bold; }
        .points { background: #f0f0f0; padding: 10px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="profile">
        <h1>SkillRack Profile</h1>

        <div class="section">
            <h2>Personal Information</h2>
            <div class="data-item"><span class="label">Name:</span> ${name}</div>
            <div class="data-item"><span class="label">Roll Number:</span> ${rollNumber}</div>
            <div class="data-item"><span class="label">Department:</span> ${dept}</div>
            <div class="data-item"><span class="label">Year:</span> ${year}</div>
            <div class="data-item"><span class="label">College:</span> ${college}</div>
        </div>

        <div class="section points">
            <h2>Points Breakdown</h2>
            <div class="data-item"><span class="label">Code Tutor:</span> ${codeTutor}</div>
            <div class="data-item"><span class="label">Code Track:</span> ${codeTrack} (${codeTrack * 2} points)</div>
            <div class="data-item"><span class="label">Code Test:</span> ${codeTest} (${codeTest * 30} points)</div>
            <div class="data-item"><span class="label">DT:</span> ${dt} (${dt * 20} points)</div>
            <div class="data-item"><span class="label">DC:</span> ${dc} (${dc * 2} points)</div>
            <div class="data-item"><span class="label">Total Points:</span> ${points}</div>
        </div>

        <div class="section">
            <h2>Additional Information</h2>
            <div class="data-item"><span class="label">Profile URL:</span> <a href="${url}" target="_blank">${url}</a></div>
            <div class="data-item"><span class="label">Last Fetched:</span> ${lastFetched}</div>
        </div>
    </div>
</body>
</html>`;

    // Write HTML file - DISABLED to prevent Live Server auto-reload
    // const fileName = `skillrack_profile_${id}.html`;
    // fs.writeFileSync(fileName, htmlContent);
    // console.log(`\nHTML file generated: ${fileName}`);

    // Display results in console
    console.log('\n=== SkillRack Profile Data ===');
    console.log(`Name: ${name}`);
    console.log(`Roll Number: ${rollNumber}`);
    console.log(`Department: ${dept}`);
    console.log(`Year Info: ${yearInfo}`);
    console.log(`College: ${college}`);
    console.log('\n=== Points Breakdown ===');
    console.log(`Code Tutor: ${codeTutor}`);
    console.log(`Code Track: ${codeTrack} (${codeTrack} x 2 = ${codeTrack * 2} points)`);
    console.log(`Code Test: ${codeTest} (${codeTest} x 30 = ${codeTest * 30} points)`);
    console.log(`DT: ${dt} (${dt} x 20 = ${dt * 20} points)`);
    console.log(`DC: ${dc} (${dc} x 2 = ${dc * 2} points)`);
    console.log('\n=== Summary ===');
    console.log(`Total Points: ${points}`);
    console.log(`Profile URL: ${url}`);
    console.log(`Last Fetched: ${lastFetched}`);
    console.log('============================\n');

    return {
      id, name, dept, year, college,
      codeTutor, codeTrack, codeTest, dt, dc,
      points, totalSolved, lastFetched, url
    };
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    console.error(`Invalid URL or network error: ${url}`);
    return null;
  }
}

// Get URL from command line argument or prompt
async function main() {
  let url = process.argv[2];

  if (!url) {
    // Start the web server
    app.listen(PORT, () => {
      console.log(`SkillRack Profile Scraper server is running on http://localhost:${PORT}`);
      console.log('Open your browser and go to http://localhost:3000 to use the web interface');
    });
    return;
  }

  // Validate URL format
  if (!url.includes('skillrack.com') || !url.includes('profile')) {
    console.error('Error: Please provide a valid SkillRack profile URL');
    console.error('Example: https://www.skillrack.com/profile/... or https://www.skillrack.com/faces/resume.xhtml?id=...');
    process.exit(1);
  }

  await fetchData(url);
}

// Run the script
main().catch(console.error);

export { fetchData };
