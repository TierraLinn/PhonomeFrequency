# PhonomeFrequency Supabase Cloud Archive Setup

This step gives PhonomeFrequency real database-backed animal profiles, reading history, acoustic feature records, and feedback history while keeping the app on free GitHub Pages.

## What This Stores

The cloud archive stores:

- animal profile metadata
- recording metadata
- decoded acoustic feature layers
- probability-based readings
- feedback labels and outcome notes
- profile maturity and confidence trends

This step does not store the original audio file bytes yet. Audio storage belongs in the next Supabase Storage milestone.

## 1. Create The Free Supabase Project

1. Go to `https://supabase.com`.
2. Sign in or create a free account.
3. Click **New project**.
4. Choose an organization.
5. Project name: `PhonomeFrequency`.
6. Choose a database password and save it somewhere private.
7. Pick the closest free region.
8. Click **Create new project**.

Wait until the project finishes provisioning.

## 2. Enable Anonymous Sign-Ins

PhonomeFrequency uses anonymous Supabase Auth for this bridge so a visitor can get a private owner id without entering email or personal information.

1. In Supabase, open the `PhonomeFrequency` project.
2. Go to **Authentication**.
3. Go to **Sign In / Providers**.
4. Find **Anonymous Sign-Ins**.
5. Turn it on.
6. Save the change.

## 3. Create The Database Tables

1. In Supabase, go to **SQL Editor**.
2. Click **New query**.
3. Open this local file:
   `supabase/schema.sql`
4. Copy the full SQL into Supabase.
5. Click **Run**.

The script creates:

- `phonome_profiles`
- `phonome_recordings`
- row-level security policies
- owner-based indexes

## 4. Copy The Public Project Keys

1. In Supabase, go to **Project Settings**.
2. Go to **API**.
3. Copy the **Project URL**.
4. Copy the public **anon** or **publishable** key.

These are used by the browser app. Do not use the service role key in GitHub Pages.

## 5. Add GitHub Repository Variables

1. Go to `https://github.com/TierraLinn/PhonomeFrequency`.
2. Open **Settings**.
3. Open **Secrets and variables**.
4. Click **Actions**.
5. Open the **Variables** tab.
6. Click **New repository variable**.
7. Add:

```text
Name: NEXT_PUBLIC_SUPABASE_URL
Value: your Supabase Project URL
```

8. Click **New repository variable** again.
9. Add:

```text
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: your Supabase anon or publishable key
```

## 6. Redeploy GitHub Pages

1. Go to the GitHub repo **Actions** tab.
2. Open **Deploy PhonomeFrequency to GitHub Pages**.
3. Click **Run workflow**.
4. Choose `main`.
5. Click the green **Run workflow** button.
6. Wait for it to finish green.

## 7. Use Cloud Sync In The App

1. Open the live app.
2. Go to **Privacy**.
3. In **Cloud archive bridge**, click **Initialize cloud identity**.
4. Click **Push local to cloud**.
5. After adding new readings, click **Push local to cloud** again.
6. On the same browser later, click **Pull cloud archive** to restore the cloud-backed profile history.

## Important Privacy Boundary

Anonymous users are tied to the browser session. If someone clears browser data, uses another device, or signs out, they may lose access to that anonymous owner id until permanent accounts are added.

For a world-ready version, the next step after this bridge is real sign-in so each person can securely return to their animals from any device.
