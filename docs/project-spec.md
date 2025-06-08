📘 Personal Website — Project Spec (v1.0)

🧭 Purpose

To create a clean, fast, and expressive personal website that:
	•	Showcases who I am and what I’m building
	•	Has some unique visual flair / aesthetic identity
	•	Sets the foundation for dynamic data viz (e.g. music taste from Last.fm)
	•	Reflects my technical style and ambition (not a cookie-cutter dev portfolio)

⸻

🧩 Core Features (MVP)

✅ 1. Homepage
	•	Name + title tagline
	•	Aesthetic layout (dark theme, big type, centered or grid-based)
	•	Vibes immediately

✅ 2. About Section
	•	Who I am
	•	What I care about (leverage, AI-native systems, etc.)
	•	Short and personal — not corporate CV

✅ 3. Projects Section
	•	2–3 projects or ideas with cards
	•	Each card: title, blurb, status (WIP, shipped, concept), and optional link
	•	Add a “view all” later if needed

✅ 4. Music Taste Section (Placeholder)
	•	Title + placeholder text or hardcoded list of fav artists
	•	In future: fetch from Last.fm → JSON → render charts / covers
	•	Keep this in mind in file structure (e.g. /components/music/ folder now)

✅ 5. Contact / Links
	•	Email, GitHub, maybe X
	•	Subtle footer or in nav

⸻

🎨 Design Direction
	•	Dark theme, slightly cyber/academic
	•	Tailwind for styling
	•	Optionally: subtle animation (Framer Motion), hover effects, maybe a custom font
	•	Minimal but expressive: not too flashy, but not boilerplate

⸻

🔧 Tech Stack

Layer	Tool
Framework	Next.js (App Router)
Lang	TypeScript
Styling	Tailwind CSS
Hosting	Vercel
Icons	Lucide (optional)
Animations	Framer Motion (optional)
Fonts	JetBrains Mono / Inter / custom vibe font
Music data	Last.fm API (future)


⸻

🔮 Future Ideas
	•	Add Last.fm fetch script (every week) → store JSON → render graph w/ Chart.js or D3
	•	Build a /music route for public listening stats
	•	Add agent-powered “Ask Me Anything” box with LLM
	•	Integrate goals/tasks section from your “goals app” idea as a widget

⸻

🛣️ Milestone Plan

Milestone	Description
v0.1	Homepage, About, Projects, deploy to Vercel
v0.2	Add music placeholder + nice layout
v0.3	Wire up static Last.fm data and render one chart
v0.4+	Add visual polish, maybe domain, maybe blog section, maybe goal tracking
