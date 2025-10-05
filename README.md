# Seizure Pregnancy Navigator

A comprehensive application to support pregnant women with epilepsy and their care teams. It provides seizure tracking, medication safety guidance, pregnancy milestones, knowledge resources, and clinician-ready reports.

## Features

- **Medication Safety**: Browse epilepsy medication safety in pregnancy and lactation with filters and curated references.
- **Pregnancy Tracker**: Due-date based timeline, trimester info, milestones, and epilepsy-specific guidance.
- **Seizure Tracking**: Log seizures and view charts and trends (UI in Next.js app).
- **Knowledge Hub**: Curated PDFs and links (RCOG, MotherToBaby, NICE, etc.), CSV export for tabular sources.
- **Reports**: Generate summaries intended for clinical visits.
- **Emergency Access**: Persistent emergency button and information.

## Monorepo Layout

```
pregnant_epilepsy/
├── seizure-pregnancy-navigator/   # Next.js 14 app (primary UI)
│   ├── app/                       # App Router pages & API route handlers
│   ├── components/                # UI components (Tailwind + lucide-react)
│   ├── lib/                       # API services, cache, error helpers
│   └── scripts/                   # API integration test script
├── server/                        # Express server (sandbox/API tester backend)
│   ├── routes/                    # Example API/testing routes
│   └── uploads/                   # File uploads (if used)
├── client/                        # CRA + MUI client (optional API tester UI)
├── data/                          # Local datasets (JSON/CSV/PDFs) and ETL scripts
└── scripts/                       # Repo-wide scripts (link checker)
```

## Tech Stack

- **Frontend (Primary)**: Next.js 14, React 18, Tailwind CSS, framer-motion, lucide-react, Recharts
- **Backend (Next API routes)**: Route handlers under `app/api/*` with lightweight caching
- **Optional Server**: Node/Express (helmet, rate limiting, CORS, winston logging)
- **Optional Client**: CRA + MUI dashboard for API testing and visualization experiments

## Quick Start

### Prerequisites
- Node.js >= 18
- npm >= 9

### Install
```bash
# from repo root
npm install
cd seizure-pregnancy-navigator && npm install
cd ../client && npm install
cd ..
```

### Run the Next.js App (primary)
```bash
cd seizure-pregnancy-navigator
npm run dev
# App: http://localhost:3000
```

### (Optional) Run Express server + CRA client
```bash
# in repo root
npm run install-all  # installs root and client deps
npm run dev          # starts Express (5000) and CRA client (3000)
```

Notes:
- The Next.js app is the primary product. The Express server and CRA client are optional utilities.
- No AWS Lambda is used; Node/Express is preferred for synchronization.

## Environment Variables

Create `seizure-pregnancy-navigator/.env.local` (see `env.example`):
```
OPENFDA_BASE_URL=https://api.fda.gov
OPENFDA_API_KEY=
NIH_BASE_URL=https://dailymed.nlm.nih.gov
NIH_API_KEY=
CDC_BASE_URL=https://data.cdc.gov
CDC_API_KEY=
WHO_BASE_URL=https://apps.who.int
WHO_API_KEY=
EPILEPSY_FOUNDATION_BASE_URL=https://www.epilepsy.com
EPILEPSY_FOUNDATION_API_KEY=
```
These are used by `lib/api-services.ts`. The app works with local data and public endpoints even if keys are empty, but rate limits may apply.

## Data Sources

Local domain datasets live in `data/` and include:
- Pregnancy categories, lactation, drug safety, epilepsy meds
- CDC reproductive health data extracts
- Curated PDFs (e.g., RCOG guideline, seizure diary) under `data/pdfs/`
- ETL/Pipelines in `data/scripts/`

The Knowledge page surfaces curated, verified PDFs/links. A link-checker script (`scripts/check-links.mjs`) can audit broken links.

## Scripts

- `seizure-pregnancy-navigator/scripts/test-api-integrations.js`: basic external API sanity tests
- `scripts/check-links.mjs`: scan repository for external URLs and audit HTTP status

## Security & Hardening

- Next.js API routes and Express server use common best practices (helmet, rate limiting on Express, input size limits)
- External requests centralized in `lib/api-services.ts` with minimal retry and error normalization

## Development Tips

- UI: Tailwind CSS + framer-motion for lightweight, accessible, responsive components
- Charts: Recharts for seizure trends and summaries
- Caching: In-memory TTL cache in `lib/cache.ts` for API responses

## Run Summary

- Primary app:
  - `cd seizure-pregnancy-navigator && npm run dev` (http://localhost:3000)
- Optional utilities:
  - `npm run dev` at repo root starts Express (5000) + CRA client (3000)

## License

MIT
