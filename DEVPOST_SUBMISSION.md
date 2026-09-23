# Devpost submission draft

**Title:** SpanLab — Teach a Model to Tag Vietnamese Addresses

**Tagline:** Learn BIO tagging by correcting a tiny machine learning model in real time.

**What it does:** SpanLab teaches beginning NLP students how a sequence labeling model turns an address into meaningful spans. Learners read a short BIO explanation, label address tokens with B/I/O tags and levels, ask an in-browser k-nearest-neighbor model to predict, inspect its votes, compare against reference labels, and add corrected examples to its training set. A progress panel shows training examples and token accuracy. The learner can export locally stored examples.

**Why we built it:** BIO tags look abstract on paper. An address is familiar, but deciding exactly where a street, ward, district, and city begins and ends forces the learner to understand entity boundaries. Showing mistakes and retraining makes the data–model feedback loop tangible.

**How it works:** A transparent 9-neighbor token classifier compares exact text, prefixes, suffixes, neighboring words, numbers, punctuation, and capitalization against annotated examples. Similar examples cast weighted votes; a simple BIO constraint repairs illegal initial I tags. All inference and storage happen in the browser. No API key or personal information is needed. This is a teaching model, not a validated geographic address parser. Example addresses are synthetic and the hierarchy is simplified for instruction.

**Technologies:** HTML, CSS, vanilla JavaScript, localStorage, weighted k-nearest neighbors.

**Challenges:** Balancing a small model that students can understand with a useful demonstration of contextual ambiguity. The interface exposes predictions and limitations instead of hiding them behind a black box.

**What we learned:** Token-level features can be understandable while still showing why local context and human corrections matter. BIO constraints are a separate step from predicting entity type.

**AI assistance disclosure:** OpenAI Codex assisted with ideation, writing, implementation, and debugging. The entrant should personally review the code, test the product, and accurately describe their own contribution before submission.

**Repository:** [add public GitHub URL]

**Live demo:** [add URL if deployed; otherwise explain how to open index.html]

**Video:** [add public, unlisted video URL, maximum 2 minutes]

## Video script (about 1:45)

0:00 — “BIO tagging marks the beginning, inside, or outside of an address entity. Here ‘Nguyễn Trãi’ begins at Nguyễn and continues at Trãi.”

0:15 — Show the lesson card, scroll to practice, click “Máy thử đoán.” “This is a small nine-neighbor classifier trained on annotated examples.”

0:35 — Hover over a predicted token. “It compares the word, its neighbors and simple shape features. The hover shows its vote share.”

0:55 — Change a label, press “Kiểm tra đáp án.” “The red outline shows a boundary or type error, with the correct tag on hover.”

1:15 — Press “Lưu & bài tiếp theo,” show training count, predict the next address. “Every completed example becomes more training data, entirely in my browser.”

1:35 — “The aim is to learn the annotation process, not to claim production accuracy. The model and data are visible and can be exported.”

**Recording tip:** Use your own screen recorder, keep the video under 2 minutes, and make the source repository public. Verify the official Devpost deadline shown in your account before posting.
