# Devpost submission draft

**Title:** SpanLab — Teach a Model to Tag Vietnamese Addresses

**Tagline:** Learn BIO tagging by correcting a tiny machine learning model in real time.

**What it does:** SpanLab teaches beginning NLP students how a sequence labeling model turns an address into meaningful spans. Learners read a short BIO explanation, label address tokens with B/I/O tags and levels, ask an in-browser k-nearest-neighbor model to predict, inspect its votes, compare against reference labels, and add corrected examples to its training set. A progress panel shows training examples and token accuracy. The learner can export locally stored examples.

**Problem and audience:** BIO tags look abstract on paper to beginning NLP students. An address is familiar, but deciding exactly where a street, ward, district, and city begins and ends forces the learner to understand entity boundaries. Showing mistakes and retraining makes the data–model feedback loop tangible.

**How it works:** A transparent 9-neighbor token classifier compares exact text, prefixes, suffixes, neighboring words, numbers, punctuation, and capitalization against annotated examples. Similar examples cast weighted votes; a simple BIO constraint repairs illegal initial I tags. All inference and storage happen in the browser. No API key or personal information is needed. This is a teaching model, not a validated geographic address parser. Example addresses are synthetic and the hierarchy is simplified for instruction.

**Technologies:** HTML, CSS, vanilla JavaScript, localStorage, weighted k-nearest neighbors.

**Technical tradeoff:** A small model remains understandable but makes mistakes on names that appear in different contexts. The interface exposes predictions and limitations instead of hiding them behind a black box.

**Technical insight:** Token-level features can be understandable while still showing why local context and human corrections matter. BIO constraints are a separate step from predicting entity type. The entrant should add only their own genuine learning and challenges here after reviewing the code and app.

**AI assistance disclosure:** OpenAI Codex generated the initial concept, wrote the application and documentation, and helped test and deploy it. The entrant should personally review the code, test the product, and accurately describe their own contribution before submission. FirstCommit emphasizes a participant's learning and understanding; do not claim manual authorship of generated code.

**Repository:** https://github.com/hoangdelima09/spanlab-bio

**Live demo:** https://hoangdelima09.github.io/spanlab-bio/

**Video:** https://hoangdelima09.github.io/spanlab-bio/spanlab-demo.mp4 (4:04 captioned walkthrough without narration; replace with your own narrated screen recording if possible)

## Video outline (about 3:50)

0:00–0:35 — Explain BIO tagging and show that “Nguyễn Trãi” begins at Nguyễn and continues at Trãi.

0:35–1:25 — Show the lesson card, scroll to practice, click “Máy thử đoán.” Explain the small nine-neighbor classifier and its annotated examples.

1:25–1:55 — Hover over a predicted token. Explain the word, neighbor, and shape features. The hover shows its vote share.

1:55–2:35 — Change a label, press “Kiểm tra đáp án.” Show an error and the reference tag on hover.

2:35–3:20 — Press “Lưu & bài tiếp theo,” show training count, predict the next address. Every completed example becomes more training data in the browser.

3:20–3:50 — State the limitations and describe what you personally learned during the event. Clearly disclose Codex's role.

**Recording tip:** Record a real walkthrough and your own explanation for 3–5 minutes. Verify the official Devpost deadline shown in your account before posting.
