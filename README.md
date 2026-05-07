# Soleil Freight BRD Automation (PoC)

This module runs a local-first BRD pipeline for Ocean Export (MBL/HBL):

1. Reset and seed test data.
2. Scan UI with Playwright and save screenshots + DOM metadata.
3. Generate Markdown BRD drafts from collected artifacts.
4. Build an internal docs site with MkDocs.
5. Export PDF snapshots locally for customer delivery.

## Quick Start

```bash
cd document-generators
npm install
npx playwright install chromium
python3 -m pip install -r requirements-docs.txt
```

## Environment Variables

- `SOLFREIGHT_BASE_URL` (default: `http://localhost:5173`)
- `SOLFREIGHT_USER`
- `SOLFREIGHT_PASSWORD`
- `OPENAI_API_KEY` (optional, if integrating real LLM calls)

## Run PoC Pipeline

```bash
npm run poc:ocean-export
```

## Run By Stage

```bash
# 1) Crawl and collect screenshots/json
npm run scan:ocean-export

# 2) Produce markdown drafts in docs/ocean-export
npm run generate:brd

# 3) Build static html docs
npm run build:docs

# 4) Export PDFs from built site
npm run export:pdf
```

## Notes

- The seeding step executes `backend/utils/seed.py --reset`.
- Generated docs are intentionally deterministic in this PoC. You can replace the drafting function with a real LLM call later.
- Keep image assets lightweight to reduce repository churn.
