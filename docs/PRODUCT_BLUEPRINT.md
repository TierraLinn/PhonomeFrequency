# PhonomeFrequency Product Blueprint

PhonomeFrequency is an animal communication intelligence platform. It is designed to map acoustic patterns from animals into probability-based communication readings using sound structure, species data, behavioral context, environmental context, repeated recordings, user-confirmed outcomes, and eventually licensed historical bioacoustic archives.

## Core Promise

PhonomeFrequency does not claim perfect animal translation. It builds translation maps: structured estimates of what an animal signal may mean, with confidence, evidence, uncertainty, and observation guidance.

## What The App Must Understand

- Animal acoustic sounds, vocalizations, calls, noise, and repeated signal shapes.
- Species-specific sound patterns.
- Individual animal history over time.
- Confirmed human observations after a sound happens.
- Emotional and behavioral context such as food, door, attention, distress, play, unknown, and other.
- Wild-animal archive data from licensed or public research projects.
- Signal evidence, not just text output.

## MVP Built Now

- Next.js app shell.
- Signal Chamber upload and microphone capture.
- Simulated analysis engine informed by browser-side acoustic features.
- Spectrogram-style visuals generated from decoded acoustic bands when possible.
- Web Audio API feature extraction for duration, amplitude, pitch estimate, centroid, pulse count, pulse rate, dominant band, waveform, and spectral bands.
- Animal profile creation.
- Echo Archive.
- Feedback loop that improves profile confidence and maturity.
- Research Vault and privacy controls.
- Local browser storage for development.
- Static health file for deployment checks.

## Next Backend Milestone

1. Add database tables for users, animal profiles, recordings, readings, feedback labels, and source archive metadata.
2. Store audio in object storage instead of local browser storage.
3. Move analysis into a server route so uploaded recordings can be queued, processed, and re-read.
4. Expand real feature extraction with richer spectrograms, pitch contours, envelope, harmonicity, repetition, and call intervals.
5. Add licensed acoustic archive ingestion.
6. Train classifiers for species, signal category, emotional state estimate, and context probability.
7. Add individual animal calibration so one pet or observed wild animal becomes more readable over time.

## Long-Term Intelligence Layer

The future intelligence layer should compare a new recording against:

- Global species-level acoustic patterns.
- Project-level archived recordings from historical bioacoustic studies.
- Similar sounds from the same individual profile.
- Recent confirmed user feedback.
- Environmental and behavioral context.
- Confidence trend and maturity of the profile.

Output should always include:

- likely species
- signal category
- plain-language interpretation
- confidence score
- evidence
- uncertainty
- recommended observation
- follow-up feedback prompt

## Safety And Credibility Boundary

PhonomeFrequency should avoid claims such as:

- perfect animal translation
- guaranteed meaning
- mind reading
- animal respond-back communication
- medical or emergency diagnosis

Preferred language:

- probability-based reading
- communication pattern estimate
- acoustic signal map
- supporting evidence
- repeated context confirmation
- profile maturity
- confidence trend
