# Seizure Pregnancy Navigator Monorepo

A unified workspace for tools that help pregnant women with epilepsy and for general API/data exploration. It contains:

- `seizure-pregnancy-navigator/`: Next.js app for seizure tracking, medication safety, pregnancy guidance, reports, and emergency info
- `client/` + `server/`: API Test Suite (React + Express) for API testing, data uploads, and visualizations
- `data/`: Curated medical datasets and Python scripts to extract/refresh real data (CDC, NIH/DailyMed, WHO, RCOG, Epilepsy Foundation)

## Features

- Seizure diary, analytics, and reports (local-first, privacy-preserving)
- Medication safety search with live augmentation (OpenFDA, DailyMed, CDC) and fallbacks to local data
- Pregnancy progress, trimester guidance, knowledge base, and emergency page
- API Test Suite to upload CSV/JSON, connect APIs, run tests in batches, and create charts/stats

## Repository Structure

```
pregnant_epilepsy/
├── seizure-pregnancy-navigator/   # Next.js 14 app (App Router)
│   ├── app/                        # Pages and API routes
│   ├── components/                 # UI components
│   └── lib/                        # API clients, cache, error handling
├── client/                         # React (CRA) frontend for API Test Suite
├── server/                         # Express backend for API Test Suite
├── data/                           # Static datasets and extraction scripts
└── scripts/                        # Repo-level utilities
```

## Prerequisites

- Node.js 18+
- npm or yarn
- (Optional) Python 3.10+ for data extraction scripts

## Getting Started

### 1) Seizure Pregnancy Navigator (Next.js)

```bash
cd seizure-pregnancy-navigator
npm install
cp env.example .env.local   # set API keys if using live data
npm run dev                 # http://localhost:3000
```

- Key routes: `app/api/external/{openfda|dailymed|cdc}`, `app/api/medications`, `app/api/pregnancy`, `app/api/seizures`, `app/api/reports`, `app/api/knowledge`
- Caching: `lib/cache.ts` (5‑minute TTL)
- UI: components such as `SeizureLogForm`, `SeizureChart`, `MedicationCard`, `ExternalDataIndicator`

### 2) API Test Suite (React + Express)

Option A (two terminals):
```bash
# Backend
cd server
npm install
npm start            # http://localhost:5000

# Frontend
cd ../client
npm install
npm start            # http://localhost:3000
```

Option B (from repo root, if you have combined scripts):
```bash
npm run dev
```

Core capabilities:
- Test REST endpoints, configure headers/body, view timings and responses
- Upload CSV/JSON, preview/manage sources, compute stats and correlations
- Generate chart data for visualizations

## Data: Datasets and Scripts

- Datasets (examples):
  - `data/epilepsy_pregnancy_comprehensive_database.json`
  - `data/comprehensive_pregnancy_data.json`
  - `data/comprehensive_lactation_database.json`
  - `data/comprehensive_pregnancy_categories.json`
  - `data/epilepsy_medication_safety_database.json`

- Scripts (run from `data/scripts/`):
```bash
python3 extract_cdc_data.py
python3 extract_pregnancy_data.py
python3 extract_pdf_data_properly.py
```
Outputs are written to `data/` and used by the Next.js app as local, offline‑first sources.

## Configuration (env)

For live integrations in `seizure-pregnancy-navigator/.env.local`:

```
OPENFDA_API_KEY=...
NIH_API_KEY=...
CDC_API_KEY=...
OPENFDA_BASE_URL=https://api.fda.gov
NIH_BASE_URL=https://dailymed.nlm.nih.gov
CDC_BASE_URL=https://data.cdc.gov
```

The app gracefully falls back to local data if external APIs fail or keys are absent.

## Privacy & Security

- Local storage by default; no user tracking; offline support
- Clear medical disclaimers; app does not replace professional advice

## License

MIT

## Support

Open an issue or discussion with context about which app (`seizure-pregnancy-navigator`, `client`, or `server`) and what you’re trying to accomplish.
