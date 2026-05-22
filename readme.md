# AI Club Analyzer 🎓✨

AI Club Analyzer is a highly responsive, modern, and intelligent web application designed to help university students map their interests, academic major, and cultural backgrounds directly into aligned campus organizations, active workshop calendars, and networking socials.

## 🚀 Concept & Features

*   **Dynamic Matching Diagnostic**: Input your name, choose from pre-populated or customized academic majors (from Computer Science to Business and STEM), select cultural and community affiliations, and toggle focus interests.
*   **Aesthetic "Geometric Balance" Theme**: A polished contemporary workspace boasting precise container geometries, high-contrast grids, vibrant micro-badges, and micro-interactive custom modals.
*   **Dual Matching Engine (High-Fidelity Offline Fallback)**:
    *   *Remote AI Pipeline*: Integrates with **Gemini v3.5 Flash** server-side, parsing student parameters against the active database index.
    *   *Local Fallback Counselor*: Seamlessly bridges connection exceptions or restricted API keys using a weighted affinity algorithm to secure 100% application uptime.
*   **Schedules & Actions Newsletter**: Sorts upcoming hackathons, professional panel summits, and mixers into a chronological calendar list with custom direct-action links.
*   **Dynamic Group Registration**: Submit custom student organization profiles through the "+ Register Group" panel to inject new dynamic clubs instantly into the active matcher pool.
*   **Analytics Summary Margin**: Floating real-time stats tracking alignment node density, mixer calendars, workshops, and active database counts.

## 🛠️ Architecture

*   **Frontend**: React (v19) + Vite, styled using deep Tailwind utility classes and elegant Lucide React iconography.
*   **Backend Proxy Service**: Node.js Express server (`server.ts`) hosting structured campus records, exposing `/api/analyze` pipelines, proxying the modern Google Gen AI SDK seamlessly, and delivering static client bundles.
*   **Database Schema**: Dynamic, extensible in-memory JSON registry model tracking organizational missions, officer councils, tagged majors, distinct ethnicities, and upcoming public event schedules.

## 📦 Run & Development

### Local Installation
1. Install node dependencies:
   ```bash
   npm install
   ```
2. Start the development server (runs full-stack Express + client bundle via tsx):
   ```bash
   npm run dev
   ```
3. Open the browser to: `http://localhost:3000`