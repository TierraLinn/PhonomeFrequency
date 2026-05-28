# PhonomeFrequency

Animal Communication Intelligence

Map the frequency of animal meaning.

PhonomeFrequency is a production-ready MVP foundation for an animal communication intelligence system. It extracts browser-side acoustic features, combines them with behavioral context and repeated signal history, and produces probability-based translation maps before real audio ML is added.

## What It Does

- Upload animal audio or record from the microphone.
- Store recordings locally in browser storage for development.
- Generate spectrogram-style visuals from decoded acoustic bands when possible, with a fallback placeholder for undecoded files.
- Extract browser-side acoustic features:
  - duration
  - frequency centroid
  - estimated pitch
  - pulse count
  - pulse rate
  - dominant band label
- Produce probability-based readings with:
  - likely species
  - signal category
  - plain-language interpretation
  - signal confidence
  - pattern strength
  - profile maturity
  - supporting evidence
  - recommended observation
- Create animal profiles for pets.
- Track recordings, confirmed context labels, strongest repeated signal, maturity, and confidence trends.
- Collect post-reading feedback:
  - Was this accurate?
  - What happened after the sound?
  - food, door, attention, distress, play, unknown, other
- Use feedback to improve the animal profile over time.

## Important Boundary

These readings are probabilistic, not absolute. PhonomeFrequency analyzes acoustic structure, species patterns, behavior, environment, and repeated signal history. The more confirmed recordings added over time, the stronger the animal's individual communication profile becomes.

PhonomeFrequency does not claim perfect animal translation. This MVP does not include animal sound playback or respond-back features.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Web Audio API feature extraction
- Local browser storage for MVP data

## Run Locally

```powershell
cd "C:\Users\tierr\Documents\Codex\2026-05-03\i-want-to-create-a-factory\PhonomeFrequency"
npm install
npm run dev
```

Open:

```text
http://localhost:8787
```

## Scripts

```powershell
npm run dev
npm run build
npm run start
npm run lint
```

## Main Routes

- `/` - Landing page
- `/signal-chamber` - Audio upload and microphone recording
- `/reading` - Latest bioacoustic reading
- `/archive` - Echo Archive
- `/profiles` - Species Matrix and profile creation
- `/profiles/detail?id=...` - Animal Profile page
- `/research-vault` - Research and roadmap notes
- `/settings` - Privacy, export, and reset controls

## Next Real ML Steps

1. Expand browser-side extraction into richer pitch contours, envelopes, and call intervals.
2. Add durable file storage and a database backend.
3. Build licensed acoustic archive ingestion for public and partner bioacoustic datasets.
4. Build species-specific acoustic feature extraction.
5. Train context-aware classifiers using confirmed feedback labels.
6. Add profile-specific calibration so repeated individual recordings become more useful over time.

## Planning Docs

- `docs/PRODUCT_BLUEPRINT.md`
- `docs/DEPLOYMENT.md`
- `docs/GROUND_UP_BUILD_PLAN.md`

## Free Deployment

This project includes a GitHub Actions workflow for free GitHub Pages deployment.

After upload, enable GitHub Pages with **Source: GitHub Actions**. The live site will publish from the generated `out` folder.
