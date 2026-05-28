# PhonomeFrequency Deployment Guide

The current app is deployment-ready as a Next.js MVP. It uses browser localStorage for development data, so it can be deployed publicly before a database is added.

## Local Run

```powershell
cd "C:\Users\tierr\Documents\Codex\2026-05-03\i-want-to-create-a-factory\PhonomeFrequency"
npm install
npm run dev
```

Open:

```text
http://localhost:8787
```

If port `8787` is busy:

```powershell
npx next dev -p 8788
```

## Production Build Check

```powershell
npm run build
```

## Health Check

After running locally:

```text
http://localhost:8787/health.json
```

Expected response:

```json
{
  "ok": true,
  "service": "PhonomeFrequency",
  "mode": "static-github-pages-mvp"
}
```

## GitHub Pages Free Deployment

1. Push this project to GitHub.
2. Open the repository on GitHub.
3. Go to **Settings**.
4. Go to **Pages**.
5. Under **Build and deployment**, set **Source** to **GitHub Actions**.
6. Go to the **Actions** tab.
7. Open **Deploy PhonomeFrequency to GitHub Pages**.
8. If it has not started automatically, select **Run workflow**.
9. Wait for the workflow to finish.
10. Open the Pages URL shown by GitHub.
11. Open `/health.json` on the deployed URL.

## Public MVP Limitations

- Recordings are stored locally in each user's browser.
- Audio is not uploaded to a backend yet.
- Analysis is simulated, not real ML.
- No historical archive ingestion is connected yet.
- No account system is connected yet.
- GitHub Pages is static hosting, so backend APIs are not active yet.

## Real Public Tool Milestones

1. Add authentication.
2. Add database-backed profiles and readings.
3. Add object storage for audio.
4. Add server-side analysis jobs.
5. Add licensed/public animal acoustic archive ingestion.
6. Add real ML inference.
7. Add user consent, retention, deletion, and export controls.
