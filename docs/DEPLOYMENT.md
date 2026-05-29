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

## Optional Supabase Cloud Archive

The app can stay fully local on GitHub Pages, or it can sync profiles, readings, acoustic feature layers, and feedback to Supabase.

To activate the cloud archive:

1. Follow `docs/SUPABASE_SETUP.md`.
2. Add these GitHub repository variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Rerun the GitHub Pages workflow.
4. Open **Privacy** in the live app.
5. Use **Initialize cloud identity**, then **Push local to cloud**.

## Public MVP Limitations

- Original audio file bytes are stored locally in each user's browser until Supabase Storage is added.
- Cloud sync stores recording metadata, readings, acoustic features, and feedback when configured.
- Analysis is feature-informed and simulated, not real trained ML.
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
