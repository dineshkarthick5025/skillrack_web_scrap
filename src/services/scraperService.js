// src/services/scraperService.js
import axios from 'axios';
import * as cheerio from 'cheerio';
import { config } from '../config/config.js';

/**
 * Fetches and scrapes SkillRack profile data for the given URL
 * @param {string} url - The SkillRack profile URL
 * @returns {Promise<object|null>} The scraped profile data or null if it fails
 */
export async function fetchProfileData(url) {
  try {
    console.log('Fetching data from URL:', url);
    
    // Extract the resume id from the URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    // Support either path-based ID (e.g. /profile/12345) or query-based ID (e.g. ?id=12345)
    let id = pathParts[2]; 
    if (!id) {
      id = urlObj.searchParams.get('id');
    }
    
    if (!id) {
      id = 'unknown';
    }
    console.log('Extracted ID:', id);

    const { data } = await axios.get(url, {
      timeout: config.SCRAPER.timeout,
      headers: config.SCRAPER.headers
    });
    
    const $ = cheerio.load(data);

    console.log('Page HTML length:', data.length);
    console.log('First 1000 characters of HTML:', data.substring(0, 1000));

    // Extract raw text array from profile sidebar (Personal info)
    const rawText = $('div.ui.four.wide.center.aligned.column').text().trim().split('\n');
    console.log('Raw text array:', rawText);
    
    const name = rawText[0]?.trim() || 'Not found';
    const rollNumber = rawText[2]?.trim() || 'Not found';
    const dept = rawText[4]?.trim() || 'Not found';
    const college = rawText[6]?.trim() || 'Not found';
    const yearInfo = rawText[8]?.trim() || 'Not found';
    
    const yearMatch = yearInfo.match(/\d{4}$/);
    const year = yearMatch ? yearMatch[0] : 'Not found';
    
    // Extract score fields matching original logic
    const codeTutor = parseInt($('div:contains("DT")').next().find('.value').text().trim()) || 0;
    const codeTrack = parseInt($('div:contains("CODE TEST")').next().find('.value').text().trim()) || 0;
    const codeTest = parseInt($('div:contains("PROGRAMS SOLVED")').next().find('.value').text().trim()) || 0;
    const dt = parseInt($('div:contains("DC")').next().find('.value').text().trim()) || 0;
    const dc = parseInt($('div:contains("CODE TRACK")').next().find('.value').text().trim()) || 0;

    // Calculate points using the original math formula
    const points = codeTrack * 2 + codeTest * 30 + dt * 20 + dc * 2;

    // Total Solved calculation
    const totalSolved = dt + codeTutor + dc + codeTrack + codeTest;

    // Format last fetched date
    const date = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });
    const lastFetched = date.split(',')[1]?.trim() || date;

    // Display results in console for backend logs (retaining original behavior)
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
      id, name, rollNumber, dept, year, college, yearInfo,
      codeTutor, codeTrack, codeTest, dt, dc,
      points, totalSolved, lastFetched, url
    };
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    console.error(`Invalid URL or network error: ${url}`);
    return null;
  }
}

/**
 * Generates dynamic HTML content for a profile (matching original structure)
 * @param {object} data - Scraped profile data
 * @returns {string} The dynamic HTML content
 */
export function generateHtmlProfile(data) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SkillRack Profile - ${data.name}</title>
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
            <div class="data-item"><span class="label">Name:</span> ${data.name}</div>
            <div class="data-item"><span class="label">Roll Number:</span> ${data.rollNumber}</div>
            <div class="data-item"><span class="label">Department:</span> ${data.dept}</div>
            <div class="data-item"><span class="label">Year:</span> ${data.year}</div>
            <div class="data-item"><span class="label">College:</span> ${data.college}</div>
        </div>

        <div class="section points">
            <h2>Points Breakdown</h2>
            <div class="data-item"><span class="label">Code Tutor:</span> ${data.codeTutor}</div>
            <div class="data-item"><span class="label">Code Track:</span> ${data.codeTrack} (${data.codeTrack * 2} points)</div>
            <div class="data-item"><span class="label">Code Test:</span> ${data.codeTest} (${data.codeTest * 30} points)</div>
            <div class="data-item"><span class="label">DT:</span> ${data.dt} (${data.dt * 20} points)</div>
            <div class="data-item"><span class="label">DC:</span> ${data.dc} (${data.dc * 2} points)</div>
            <div class="data-item"><span class="label">Total Points:</span> ${data.points}</div>
        </div>

        <div class="section">
            <h2>Additional Information</h2>
            <div class="data-item"><span class="label">Profile URL:</span> <a href="${data.url}" target="_blank">${data.url}</a></div>
            <div class="data-item"><span class="label">Last Fetched:</span> ${data.lastFetched}</div>
        </div>
    </div>
</body>
</html>`;
}
