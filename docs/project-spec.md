📘 Personal Website — Project Spec (v2.0)

🧭 Purpose

To create an immersive, game menu-inspired personal website that:
	•	Establishes personal brand and identity (not portfolio-first)
	•	Feels like navigating a console game interface (PS2/Xbox dashboard style)
	•	Has unique retro-futurism aesthetic with functional UI elements
	•	Sets foundation for dynamic modules (music viz, goals, etc.) within the menu system
	•	Makes all key links and navigation immediately accessible

⸻

🧩 Core Features (MVP)

✅ 1. Main Menu System
	•	Console-style navigation menu (like game main menu)
	•	Large selectable options: About, Projects, Now, Contact
	•	Active selection indicator (LED/glow effect)
	•	Smooth transitions between menu sections

✅ 2. About Module
	•	Personal narrative focused on identity and ambitions
	•	What I care about (leverage, AI-native systems, etc.)
	•	Presented as a game menu panel/window

✅ 3. Projects Module
	•	Accessed through menu navigation
	•	2–3 projects displayed as interactive cards
	•	Each card: title, blurb, status (WIP, shipped, concept), and optional link
	•	Styled like game UI elements or synth controls

✅ 4. Music Module (Placeholder)
	•	Placeholder for future Last.fm integration
	•	Hardcoded list of favorite artists for now
	•	Prepare structure for future visualizations
	•	Styled as audio/media control panel

✅ 5. Global Link Dock
	•	Always-visible row of icon links (GitHub, X, Email)
	•	Bottom dock or integrated into frame
	•	Immediate access without navigation

⸻

🎨 Design Direction
	•	Retro-futurism game UI (PS2/Xbox era menus)
	•	Dark base with neon/LED accents (green, blue, red)
	•	Depth through shadows, gradients, and bevels
	•	Panel-based layout with gloss/glass effects
	•	Motion design for menu navigation and hover states
	•	NOT: CRT effects, vaporwave, or overly minimal

⸻

🔧 Tech Stack

Layer	Tool	Notes
Framework	Next.js (App Router)	Existing setup
Lang	TypeScript	Type safety
Styling	Tailwind CSS	May need custom CSS for advanced effects
3D/WebGL	React Three Fiber	Optional for true 3D menu effects
Hosting	Vercel	Fast deployment
Icons	Lucide / Custom SVGs	Game-style icons
Animations	Framer Motion	Menu transitions & hover states
Fonts	Orbitron / Eurostile	Retro-futuristic feel
Music data	Last.fm API	Future integration


⸻

🔮 Future Ideas
	•	Add Last.fm real-time data with visualizations
	•	3D menu navigation using React Three Fiber
	•	Sound effects for menu navigation (optional)
	•	Dynamic background effects (particles, grid)
	•	Terminal mode for power users
	•	Achievement system for site exploration

⸻

🛣️ Milestone Plan

Milestone	Description
v0.1	Basic site with sections, deploy to Vercel
v0.2	Game menu navigation system implemented
v0.3	Full retro-futurism styling and animations
v0.4	Music data integration + visualizations
v0.5	3D effects and advanced interactions