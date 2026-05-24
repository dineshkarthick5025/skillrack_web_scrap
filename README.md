# ⚡ SkillRack Profile Scraper & Analytics Dashboard

A modern, production-grade, modular Node.js Express application and high-fidelity glassmorphic web dashboard to scrape, analyze, and visualize candidate profile performance scores from SkillRack.

---

## 📸 Overview
This project operates in **Dual-Mode**:
1. **Command Line Interface (CLI)**: Scrapes and logs parsed academic information and points breakdown directly into your terminal.
2. **Web Dashboard Service**: Serves an ultra-premium, dark-mode glassmorphic single-page application dashboard to analyze profiles interactively in real time.

---

## 📁 Modular Directory Structure

The project has been refactored from a single-file script into a clean, scalable architectural pattern:

```
skillrack_web_scrap/
├── src/
│   ├── config/
│   │   └── config.js            # Environment variable loader & URL validation utility
│   ├── services/
│   │   └── scraperService.js    # Axios-Cheerio DOM scraping engine & point arithmetic parser
│   ├── controllers/
│   │   └── profileController.js # Handles request/response pipelines & validation limits
│   ├── routes/
│   │   └── profileRoutes.js     # API Route endpoint declarations (/api/fetch-profile)
│   └── app.js                   # Express application setups, CORS and static assets folder mapping
├── public/
│   └── index.html               # Premium HTML5 dashboard UI (Glassmorphic dark aesthetic)
├── server.js                    # Dual-mode application boots entrypoint
├── .env                         # Server environment configuration keys (Git ignored)
├── .env.example                 # Environment configuration sample template
├── .gitignore                   # Safe deployment exclusion definitions
├── package.json                 # Dependency manifests & execution scripts
└── README.md                    # Documentation
```

---

## ✨ Features

- **Decoupled Architecture**: Strictly adheres to the **Controller-Service-Route** design pattern.
- **Robust Scraper Engine**: Powered by `axios` and `cheerio` to query, extract, and parse candidate records safely.
- **Premium Glassmorphic Dashboard**: A fully responsive web dashboard styled with vanilla CSS, subtle micro-animations, neon-gradient glows, and clean interactive elements.
- **Environment Driven**: Fully configured using `.env` for easy adjustments (ports, timeouts, etc.).
- **Dual Mode CLI & Web**: Auto-detects arguments to execute as a quick terminal scraper or launch as an Express API service.

---

## 🛠️ Prerequisites

- **Node.js**: `v20.6.0` or higher (tested on `v24.13.0`)
- **npm**: `v10` or higher

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/dineshkarthick5025/skillrack_web_scrap.git
cd skillrack_web_scrap
npm install
```

### 2. Environment Configuration
Create a `.env` file at the root of the project:
```bash
cp .env.example .env
```

Open `.env` in your editor and configure the variables:
| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `3000` | The port on which the Express web server will listen. |
| `SCRAPER_TIMEOUT` | `10000` | Network request timeout in milliseconds for scraping SkillRack. |

---

## 📖 Usage Instructions

### 🖥️ Mode A: Interactive Web Dashboard
To launch the backend API and serve the premium analytics portal locally:
```bash
npm run dev
```
Once started, navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

Enter any valid SkillRack profile URL and click **Analyze Profile** to generate a visually stunning stats breakdown immediately.

---

### 💻 Mode B: Command Line Scraper (CLI)
To run a rapid, lightweight profile scrape directly in your console:
```bash
node server.js "YOUR_SKILLRACK_PROFILE_URL"
```

#### Example:
```bash
node server.js "http://www.skillrack.com/profile/448205/519179b117789b1acb6c9ad514b09e7d65db1792"
```

#### Expected CLI Output:
```
=== SkillRack Profile Data ===
Name: DINESH KARTHICK V
Roll Number: 312423205060
Department: IT
Year Info: (Pre-Final Year) 2027
College: St.Joseph's Institute of Technology, Chennai

=== Points Breakdown ===
Code Tutor: 265
Code Track: 807 (807 x 2 = 1614 points)
Code Test: 57 (57 x 30 = 1710 points)
DT: 6 (6 x 20 = 120 points)
DC: 28 (28 x 2 = 56 points)

=== Summary ===
Total Points: 3500
Profile URL: http://www.skillrack.com/profile/448205/...
Last Fetched: 5:26:41 pm
============================
```

---

## 🧮 Score Computation Details

The scraping engine parses statistics and applies the standard points mapping formula:

- **Total Solved Problems**: `Daily Challenge (DT) + Code Tutor + Code Track (DC) + Code Track + Code Test`
- **Total Points Formula**:
$$\text{Total Points} = (\text{Code Track} \times 2) + (\text{Code Test} \times 30) + (\text{DT} \times 20) + (\text{DC} \times 2)$$

---

## 🛡️ Git Management

The project is preconfigured with a `.gitignore` to ensure production safety. The following files are **never** committed:
- `node_modules/` (Heavy libraries package)
- `.env` (Private keys or custom ports)
- `skillrack_profile_*.html` (Locally exported dynamic pages)

---

## 📝 License
This project is licensed under the **ISC License**. Created for academic and professional statistics tracking.
