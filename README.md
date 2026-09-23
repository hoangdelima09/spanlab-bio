# SpanLab — teach a model to read Vietnamese addresses

An interactive educational prototype for BIO sequence labeling. Students annotate address tokens, inspect a machine prediction, check against a reference, and add corrected examples to a small in-browser classifier. The app runs locally and stores progress in `localStorage`; it uses no external API, account, or private data. The sample addresses are synthetic learning examples, **not an authoritative administrative gazetteer**.

## Run

Open `index.html` in a modern browser. Alternatively run `python3 -m http.server 8000` in this directory and visit `http://localhost:8000`.

## What the model actually does

`app.js` contains an instance-based k-nearest-neighbor token classifier. It compares a token's exact text, three-character prefix and suffix, digit/punctuation/capitalization flags, and immediate neighbors with annotated seed examples. Nine nearest annotated tokens vote with similarity weights. An invalid initial `I-X` is converted to `B-X`; commas are `O`. On “save,” the labeled exercise becomes additional training data. The displayed vote share is not a calibrated probability. It is a deliberately small, understandable teaching model, not a production address parser.

The learning exercise compares a student's submitted tags against reference tags, highlights differences, and records token accuracy. The exercise repeats after four addresses so a learner can observe how the model changes. BIO here uses L6 = house number, L5 = street, L4 = ward, L3 = district, L2 = province/city. These labels are pedagogical and reflect a simplified historical address hierarchy; current administrative structures vary.

## Submission notes

Built during the FirstCommit hackathon in September 2026. The public demo is at https://hoangdelima09.github.io/spanlab-bio/ . A four-minute, silent, captioned walkthrough is at https://hoangdelima09.github.io/spanlab-bio/spanlab-demo.mp4 . Disclose substantial AI coding assistance in the Devpost description. The entrant should review, run, and explain the code; a personal narrated recording would better demonstrate their learning. The contest requires a public source repository, project description, 3–5 minute video, and setup instructions. Prize eligibility, payment, and judging remain with the organizer.

## Demo outline (3–5 minutes)

1. Explain BIO with “Nguyễn / Trãi”: B-L5 then I-L5 (0:00–0:35).
2. Open the first exercise; click “Máy thử đoán” and hover to inspect its vote share (0:35–1:25).
3. Correct at least one label, check against the reference, save the corrected example (1:25–2:20).
4. Try the next example; point to updated training count and explain kNN features and local privacy (2:20–3:20).
5. State the limitation: a learning tool, not a validated parser; describe what you personally learned (3:20–3:50).

## License

MIT. See `LICENSE`.
