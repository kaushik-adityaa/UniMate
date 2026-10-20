# UniMate — Your Campus. Your Growth. Your UniMate.

> **AI Student Assistant & Mentor for Galgotias University, Greater Noida**

UniMate is a full-featured, modern, intelligent AI assistant designed specifically for students at Galgotias University. It combines the guidance of a knowledgeable senior, academic tutor, university guide, and career mentor into a single platform.

---

## 🌟 Key Features

1. **Direct Access**: Opens directly to the chat without login screens, accounts, or forced onboarding.
2. **Real Gemini AI Integration**:
   - Secure server-side proxy (`/api/chat`) using `@google/generative-ai`.
   - Real-time streaming responses via Server-Sent Events (SSE).
   - Multimodal support: Attach images of compiler errors, circuit diagrams, math problems, or university notices.
   - Persona strictly tuned for Galgotias University with strict factual accuracy guidelines (never fabricates unverified fees, attendance rules, dates, or policies).
3. **Interactive First-Visit Welcome Screen**:
   - Official welcome message.
   - 6 interactive prompt cards (Fresher Starter Guide, Hackathons & Internships, Exam Preparation, Placement Preparation, Clubs & Campus Life, University Life).
4. **Dedicated Student Assistant Hubs**:
   - **Fresher's Guide**: 10 comprehensive categories (Getting Started, Academics & Attendance, Classes & Exams, Campus Facilities, Clubs & Societies, Making Friends & Networking, Hackathons & Events, Skills & Career Preparation, Hostel & Accommodation, FAQs).
   - **Academic Help**: Interactive curriculum guides for DSA, C++, Java, Python, DBMS/SQL, Web Development, OS/Networks, and Lab Viva Master.
   - **Career & Opportunities**: Roadmaps for coding interviews, resume/LinkedIn optimization, GitHub projects, internships, Smart India Hackathon (SIH), and Open Source/GSoC.
   - **Campus Life**: Greater Noida Knowledge Park survival guide, hostel vs PG breakdown, time management, and club recruitment strategies.
5. **Robust Local Storage Management**:
   - Complete local chat history persistence.
   - Rename conversations, delete individual chats, and clear all history with accessible confirmation dialogs.
6. **Polished Design & Aesthetics**:
   - Dark mode default (`#0A0A0A`) inspired by Linear and Vercel.
   - Light mode with clean neutral palette.
   - Syntax-highlighted code blocks with language badge and one-click **Copy Code** button.
   - Full Markdown rendering with responsive tables, blockquotes, and safe external links.
   - Collapsible left sidebar on desktop and navigation drawer on mobile.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons
- **Markdown & Code**: `react-markdown`, `remark-gfm`, `highlight.js`
- **Backend**: Node.js & Express 5 (Server-side proxy on port 3001)
- **AI Model**: Google Gemini (`gemini-1.5-flash` with fallback to `gemini-2.0-flash` / `gemini-1.5-pro`)
- **State & Storage**: React Context + Browser `localStorage`

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or higher installed)

### 2. Configure Your Gemini API Key
UniMate connects to Google Gemini through a secure backend server. To configure your free API key:

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click **Create API Key** (free with generous limits).
3. Choose one of two ways to configure it:
   - **Option A (In-App Modal):** Start the application, click **API Key** in the sidebar footer (or the alert banner at the top), paste your key, and click **Save & Test Connection**.
   - **Option B (Direct `.env`):** Open the `.env` file in the project root and add your key:
     ```env
     PORT=3001
     GEMINI_API_KEY=AIzaSyYourActualKeyHere
     GEMINI_MODEL=gemini-1.5-flash
     ```

### 3. Run Locally in Development Mode
Run the development command which concurrently starts the Express backend server on port 3001 and the Vite frontend on port 5173:

```bash
npm run dev
```

Then open your browser at:
```
http://localhost:5173
```

### 4. Build for Production
To generate an optimized production bundle:

```bash
npm run build
npm start
```
The server will serve both the backend API and the compiled static frontend on `http://localhost:3001`.

---

## 🔒 Security Architecture

- **No Client-Side Secrets**: `GEMINI_API_KEY` is never bundled into frontend JavaScript, exposed in network headers, or sent to the browser.
- **Payload & Image Validation**: Attached images are validated for allowed MIME types (PNG, JPEG, WEBP, GIF, HEIC) and capped at 10MB on the server.
- **Safe HTML**: Markdown outputs are parsed safely without raw unsanitized HTML execution.

---

## 🏛️ University Factual Accuracy Rules

UniMate strictly adheres to factual accuracy principles:
- **Never fabricates** official Galgotias University examination dates, continuous assessment schedules, fee amounts, attendance relaxation policies, or faculty contacts.
- Clearly flags guidance requiring official confirmation from the **Galgotias Registrar**, **School Dean**, or **SIMS ERP portal**.
- Separates general academic advice from verified university notices.
