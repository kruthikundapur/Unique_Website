## Social Impact Hub — Overview & Features

This is an immersive 3D platform where you meet five AI specialists and explore domains that matter: Education (Sophia), Healthcare (Dr. Marcus), Mental Health (Luna), Career (Alex), and Environment (Terra). Click an avatar to start a real-time conversation, use voice controls if you prefer speaking, and track your progress as you make an impact.

### What you can do
- Start AI conversations with specialized avatars
- Walk around an interactive 3D hub
- Use voice controls and accessibility options
- Track progress and unlock simple achievements

### Under the hood
- **Frontend**: React 18 + TypeScript, @react-three/fiber, Tailwind, Radix UI
- **Backend**: Express + TypeScript
- **AI**: OpenAI GPT-4o
- **Build**: Vite; GLSL support for shaders

### Quick start
1) Create a `.env` file in the project root and add:
```
OPENAI_API_KEY=your_openai_api_key_here
```
2) Install dependencies:
```
npm install
```
3) Run the app:
```
npm run dev
```
Open `http://localhost:5000`.

### Good places to start reading code
- `client/src/App.tsx` — application entry view
- `client/src/components/3d/` — 3D scene, avatars, effects, particles
- `server/` — API routes and AI/voice services


