# SoccerVision Presenter Script

Target flow:
- Presentation: about 30 minutes
- Demo: about 15 minutes
- Total prepared talk: about 45 minutes

Use this as a rehearsal script, not something to read word-for-word. The goal is to sound prepared, direct, and honest.

---

## 30-Minute Presentation

### 1. Introduction - 2 min

**Core point:** This was a fast product investigation, not a from-scratch model-training project.

Say:
> I approached SoccerVision as an early-stage product and technical investigation. The question was not just "can AI see soccer?" It was: what useful data can we extract from match footage, what are the real technical challenges, and how would that become something a coach could actually use?
>
> Because this was a short task, I did not try to train every model from scratch. I assembled proven building blocks: vision-language models, open-source computer vision, public soccer references, and a working web dashboard. Then I used the proof of concept to identify what would need proper validation next.

Transition:
> I’ll start by mapping the task to the work, then walk through users, data, architecture, tradeoffs, validation, design iteration, and finally the demo.

---

### 2. Task Coverage - 1.5 min

**Core point:** Every part of the prompt is intentionally covered.

Say:
> I wanted to make sure the task was answered directly. The prompt asked what data could be extracted, which ML techniques might apply, what challenges exist, and what insights could be useful in practice.
>
> So I structured the work around six questions: what can we extract, what models fit each part, what makes soccer video difficult, what insights become valuable, how I would research it, and how I would evaluate it with more time.

Transition:
> The first thing I researched was not the model. It was the user.

---

### 3. Users - 1.5 min

**Core point:** Coaches need fast, specific, contextual outputs.

Say:
> The primary user is the coaching staff: head coach, assistants, and tactical analysts. Players are secondary users because they receive the filtered output in clips, feedback, and training targets.
>
> The need is not "more data." It is speed, specificity, language, and context. A coach does not need 300 raw coordinates. They need the two or three moments that explain what changed the game and what to do in training.

Transition:
> That user need defines the actual problem.

---

### 4. Problem - 2 min

**Core point:** Existing workflows are slow and fragmented.

Say:
> Soccer analysis today is split between manual video review and statistical tools. Manual review is rich but slow. Stats are fast but often lack context.
>
> A possession number does not explain why a press failed. A shot count does not tell you whether the chance came from a repeatable pattern. Coaches often know something went wrong, but proving it and showing it to players takes time.
>
> So success here means surfacing key moments, connecting them to context, and producing something useful before the next session.

Transition:
> I then looked at what already exists and where the gap is.

---

### 5. Landscape - 1.5 min

**Core point:** Existing tools are strong, but the opportunity is interpretation.

Say:
> Legacy platforms like Wyscout, InStat, and Opta are powerful and trusted, but they often depend on manual tagging and delayed workflows.
>
> Computer vision trackers can produce high-frequency data, but coordinates alone are not coaching insight. The opportunity I focused on is the bridge: AI that can extract structure from video and turn it into coaching language.

Transition:
> To keep the task realistic, I scoped the first version tightly.

---

### 6. Scope - 1.5 min

**Core point:** Short broadcast clips first; full real-time analysis later.

Say:
> I scoped this to standard broadcast footage and short clips, around one to three minutes. That is enough to prove upload, extraction, event review, metrics, and insight generation.
>
> Out of scope for this proof of concept were full 90-minute matches, real-time streaming, multi-camera support, biometrics, and injury risk. Those are valuable, but they require better infrastructure and stronger validation.

Transition:
> With the scope defined, I treated the system as building blocks.

---

### 7. Research Inputs & Building Blocks - 2 min

**Core point:** The proof of concept uses existing blocks responsibly.

Say:
> I treated this like assembly, not reinvention. For a short task, the responsible move was to use credible existing pieces and learn where they break.
>
> The building blocks were: soccer analytics workflow research, public footage and SoccerNet-style references, Claude for interpretation and synthesis, a YOLO worker path for dense computer vision, and a dashboard to turn the output into something usable.
>
> The current repo proves the workflow. The next research-grade path would be a soccer-specific detector, stable tracking, homography, labeled benchmarks, and hosted inference.

Transition:
> Next is the data question: what can actually come out of video?

---

### 8. Data Extraction - 1.5 min

**Core point:** Video contains spatial, temporal, identity, and tactical signals.

Say:
> I grouped the extractable data into four categories.
>
> Spatial: where players and the ball are. Temporal: what happens over time, like passes, shots, tackles, corners. Identity: which players belong to which team. Tactical: shape, spacing, line height, pressure, and chance context.
>
> Those raw signals become heatmaps, event timelines, possession split, team comparison, xG, and coaching recommendations.

Transition:
> But each metric needs to be honest about what powers it.

---

### 9. What Powers The Metrics - 3 min

**Core point:** The dashboard distinguishes direct evidence from inferred metrics.

Say:
> This slide is important because it keeps the demo honest. Not every number has the same confidence.
>
> Possession comes from frame-level possession samples. Shots and shots on target come from verified shot-like events. Goals are scoreboard-first when a scoreboard is legible, and clip goals are only counted when the score increases after the clip baseline.
>
> xG is either vision-estimated from key frames or falls back to a positional formula. Passes currently come from reviewed pass events, while a denser tracking path would improve pass counting from possession-chain changes.
>
> Ball retention is heuristic, not true pass accuracy. Distance is low-confidence unless stable IDs and pitch calibration are available. Heatmaps and shape come from player positions binned over time, with true pitch coordinates preferred when homography succeeds.

Transition:
> That leads into the architecture: how the app actually turns video into those outputs.

---

### 10. Architecture - 2 min

**Core point:** The system is a hybrid proof of concept.

Say:
> The app starts in the browser. It extracts frames from the video at 1280 by 720 so the ball has a better chance of remaining visible.
>
> From there, the current proof of concept can use Claude as a fallback frame interpreter, or a YOLO worker path when configured. Then it estimates pitch view, reviews candidate events, and sends selected frames plus metrics into a synthesis step.
>
> The key idea is separation of responsibilities: computer vision extracts structure, and language models help review ambiguity and produce coaching language.

Transition:
> The next slide maps that to actual repo files.

---

### 11. Pipeline Deep Dive - 2.5 min

**Core point:** The implementation has concrete routes and data shapes.

Say:
> In the actual code, `app/page.tsx` handles upload, keyframe extraction, concurrency, and client-side merging.
>
> `/api/analyze/frame` is the Claude fallback frame route. `/api/analyze/pitch` estimates the visible pitch window. `/api/analyze/events` reviews candidate moments, reads scoreboard values when visible, and handles low-confidence fallbacks. `/api/analyze/summarize` deduplicates events, builds team stats, selects key frames, and produces the final `MatchAnalysis` JSON.
>
> The optional YOLO worker can produce dense frame data and should become the primary production extraction layer.

Transition:
> That is why the model choice is hybrid.

---

### 12. ML & AI Techniques - 2 min

**Core point:** Different tools fit different jobs.

Say:
> Claude Vision is useful for quick prototyping and interpreting sampled frames, but it is not the right tool for dense frame-by-frame tracking.
>
> Claude Opus, or a stronger synthesis model, is better used once per analysis after metrics and key frames are prepared. That is where reasoning and coaching language matter.
>
> YOLO is the production path for detection and tracking: players, ball, referees, dense frames, and eventually pitch-calibrated positions. But YOLO gives structure, not meaning.
>
> So the best architecture is hybrid: CV handles volume; LLMs handle judgment and explanation.

Transition:
> I expect that architecture choice to be questioned, so I made the tradeoffs explicit.

---

### 13. Architecture Tradeoffs - 2 min

**Core point:** Be ready for "why not X?"

Say:
> Why not Claude-only? Because it is too slow and expensive for dense tracking, and it does not guarantee stable IDs.
>
> Why not YOLO-only? Because boxes and coordinates do not tell a coach why the moment mattered.
>
> Why not train from scratch? Because in a short task, assembling proven blocks showed product direction faster. With more time, I would fine-tune the soccer-specific detector.
>
> Why short clips first? Because a short clip proves the workflow before adding the complexity of full-match processing.
>
> My final stance is: current POC uses Claude fallback plus optional YOLO worker; production should use YOLO, tracking, and homography first, then Claude for review and coaching synthesis.

Transition:
> The tradeoffs connect directly to the hardest technical challenges.

---

### 14. Challenges & Validation - 2 min

**Core point:** Soccer video is hard because of broadcast conditions and ambiguous events.

Say:
> The hard parts are latency, camera motion, event ambiguity, and scoreboard reading.
>
> Broadcast cameras pan and cut. The ball is tiny. Players overlap. A raised arm might be a celebration, a complaint, or a normal gesture. A scoreboard may show a previous goal, not a goal inside the uploaded clip.
>
> So the POC uses internal checks: candidate events, deduplication, confidence flags, conflict surfacing, and scoreboard-baseline logic.

Transition:
> With more time, I would turn those checks into a proper benchmark.

---

### 15. Evaluation Plan - 2 min

**Core point:** Evaluation was planned honestly as the next step.

Say:
> Because this was a fast task, I focused on proving the workflow. The next step would be measuring each signal.
>
> For detection: precision and recall for players, ball, goalkeeper, referee. For tracking: ID switches and missed ball frames. For calibration: pitch-coordinate error. For events: timestamp accuracy for passes, shots, saves, goals, corners, fouls.
>
> I would also evaluate the product: would coaches actually use the recommendations? And operationally: how long does it take, what does it cost, and does it fail gracefully?

Transition:
> I also iterated the product surface as the problem got clearer.

---

### 16. Product & Design Iteration - 1.5 min

**Core point:** The interface moved from dashboard to coach-ready report.

Say:
> The first usable version was a dashboard: field, timeline, stats, heatmap, and comparison panels. That proved the data could be rendered.
>
> Then I moved toward a more coach-ready report: summary first, confidence visible, key metrics up front, and recommendations tied to evidence.
>
> The design iteration reflects the product lesson: raw analytics are useful, but coaches need a story they can act on.

Transition:
> That brings us to the demo output.

---

### 17. Demo Slide - 1 min

**Core point:** The proof of concept produces a coaching report.

Say:
> This is the report direction. The clip becomes score context, a plain-English summary, an outcome projection, metric cards, confidence indicators, and coach-facing insights.
>
> The goal is not to replace an analyst. It is to reduce the time between watching a clip and knowing what is worth reviewing.

Transition:
> After the demo, I’ll close with where I would take it next.

---

### 18. With More Time - 2 min

**Core point:** The roadmap is better data, better model, better geometry, better deployment.

Say:
> With more time, I would move from proof of concept to measurable production pipeline.
>
> First, create or obtain a labeled soccer benchmark: players, ball, referees, landmarks, shots, passes, goals. Second, fine-tune a soccer detector and add stronger tracking. Third, use pitch homography everywhere so tactical shape and distance are based on real coordinates.
>
> Then I would decide infrastructure: local worker for demos and cost control; hosted GPU worker for team use and faster turnaround. Finally, I would add coach-in-the-loop correction so analysts can improve the data over time.

Transition:
> The takeaway is simple.

---

### Closing - 1 min

**Core point:** The value is connecting existing pieces into a useful workflow.

Say:
> The pieces already exist: computer vision, language models, cloud infrastructure, soccer datasets, and dashboard tooling.
>
> The work is knowing which pieces to connect, where each one is strong, where it is weak, and how to turn the output into something a coach can use.
>
> SoccerVision is a proof of concept, but it shows a clear path from raw match footage to structured insight.

---

## 15-Minute Demo Script

### Demo Setup - 1 min

Say:
> I’ll now show the working proof of concept. The demo is scoped to short clips, because the goal is to prove the workflow end to end: upload, extraction, analysis, metrics, and coaching output.
>
> If the live model path is unavailable, demo mode loads precomputed match analysis so the dashboard can still be reviewed.

### Step 1: Upload / Demo Mode - 2 min

Show:
- Home/upload screen or demo button
- Accepted short clip flow

Say:
> The browser extracts sampled frames using Canvas. The full video does not need to be sent through the frame-analysis route. The system works from sampled images plus optional worker metadata.
>
> This is one of the early design decisions: keep the interactive path fast enough to demonstrate and iterate.

### Step 2: Processing Flow - 2 min

Show:
- Loading/progress state if available
- Explain what is happening behind the scenes

Say:
> Behind the scenes, the app analyzes frames with bounded concurrency. Candidate events are reviewed in batches. Scoreboard readings are collected when visible. Then the summary route builds team metrics and selects key frames for synthesis.
>
> The important thing is that the output is structured JSON, not just a text description.

### Step 3: Report Summary - 2 min

Show:
- Score
- Clip summary
- Outcome model
- Confidence / model notes

Say:
> This section gives the coach the headline: what happened in the uploaded clip and how the play was trending.
>
> The outcome projection is clip-scoped, not a full-match prediction. The scoreboard may include full-match context, but clip goals are handled separately when the score changes inside the uploaded segment.

### Step 4: Metric Cards - 2 min

Show:
- xG
- possession
- retention
- shots on target
- distance
- key events

Say:
> The metric cards are intentionally labeled with confidence or source context. For example, xG may come from the synthesis model looking at key frames or from a positional fallback. Distance is lower confidence unless stable IDs and pitch calibration are available.
>
> This is where the metric provenance slide matters: I do not want to present every number as equally certain.

### Step 5: Tactical / Event Views - 2 min

Show:
- Field / tactical shape
- Event timeline
- Heatmap / pass network if available

Say:
> The tactical surfaces show where the structured data becomes visual. Player positions become shape. Events become a timeline. Heatmaps show spatial occupancy. Pass networks are more reliable when dense tracking is available, which is why the YOLO worker is important for production.

### Step 6: Coaching Insights - 2 min

Show:
- Insight cards
- Observation
- Recommendation
- Evidence/source/confidence if visible

Say:
> This is the part that turns analysis into coaching language. Each insight should have an observation and a recommendation. The goal is to give staff something they can say in the next session, not just another chart.
>
> I would expect a coach or analyst to review these, approve useful ones, correct weak ones, and use that feedback to improve the system.

### Demo Close - 2 min

Say:
> What the demo proves is the workflow: video can become structured data, structured data can become metrics, and metrics plus key frames can become coaching insight.
>
> What it does not prove yet is production-grade accuracy. That would require the evaluation plan: labeled clips, detector/tracker benchmarks, homography accuracy, event timing accuracy, and coach review.
>
> So my recommendation is to keep this hybrid architecture, make YOLO/tracking/homography the primary production layer, and use language models for review and synthesis.

---

## Quick Backup Answers

### If they ask: "Why did you use Claude at all?"

> I used Claude because it let me prototype interpretation quickly. But I would not rely on it as the primary dense tracker in production. Production should use a CV worker first, then use Claude for event review and coaching synthesis.

### If they ask: "Why not just use YOLO?"

> YOLO can detect objects and produce coordinates, but it does not produce coaching language or tactical interpretation by itself. The useful product is the combination: CV for structure, LLM for explanation.

### If they ask: "Why not train from scratch?"

> Time. For a short task, assembling credible building blocks proved the workflow faster. With more time, I would label a benchmark and fine-tune the detector.

### If they ask: "How would you know if it works?"

> I would evaluate detection recall, tracking ID switches, pitch-coordinate error, event timestamp accuracy, metric calibration, latency, cost, and coach usefulness.

### If they ask: "What is the biggest risk?"

> Overstating confidence. Soccer video is noisy, so the system must expose confidence, flag low-quality metrics, and keep a coach or analyst in the loop.

