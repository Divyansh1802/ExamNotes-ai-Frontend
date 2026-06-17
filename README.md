# NoteForge — AI Exam Notes Generator

> Turn any topic into structured, exam-ready study notes powered by AI.

NoteForge is a full-stack web application that generates comprehensive study notes from a topic, class level, and exam type. It produces structured documents with headings, paragraphs, tables, charts, code blocks, and references — all rendered in a clean, dark-themed UI.

**Live demo:** https://examnotes-ai-frontend.onrender.com

---

## Features

- **AI-generated notes** — Enter a topic, level, and exam type to get a fully structured document in seconds
- **Rich document blocks** — Headings, paragraphs, tables, charts (bar, line, area, pie, scatter), code blocks, quotes, and lists
- **Interactive charts** — Powered by Recharts; unsupported chart types gracefully fall back to a plain table
- **Two auth methods** — Google OAuth (via Spring Boot / Spring Security) or email OTP login
- **Session-based auth** — Cookie-based sessions managed by the Spring Boot backend; the frontend checks `/api/profile` on every protected page load
- **Animated processing view** — A 6-stage progress indicator and skeleton loader while notes are being generated
- **Dark-first UI** — Built with Tailwind v4, shadcn/ui, and Geist font; dark mode only

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS v4, shadcn/ui |
| Charts | Recharts |
| Font | Geist (via `next/font`) |
| Analytics | Vercel Analytics |
| Auth backend | Spring Boot + Spring Security (Google OAuth2 + OTP) |
| AI backend | LangChain bot (FastAPI on Render) |

---

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout — fonts, Toaster, Analytics
│   ├── page.tsx            # Home page (protected by AuthGuard)
│   └── login/
│       └── page.tsx        # Login page — Google OAuth + email OTP
│
├── components/
│   ├── app-header.tsx      # Sticky nav with logout button
│   ├── brand-logo.tsx      # NoteForge logo + Google icon SVG
│   ├── auth/
│   │   ├── auth-guard.tsx  # Session check; redirects unauthenticated users
│   │   └── login-form.tsx  # Two-step login: Google redirect or email → OTP
│   └── notes/
│       ├── notes-studio.tsx    # Main state machine (idle → loading → done | error)
│       ├── generate-form.tsx   # Input form: topic, class/level, exam type
│       ├── processing-view.tsx # Animated progress stages + skeleton preview
│       ├── document-view.tsx   # Block-by-block document renderer
│       └── chart-block.tsx     # Recharts wrapper with table fallback
│
├── lib/
│   ├── api.ts      # All fetch functions and endpoint constants
│   ├── types.ts    # NotesDocument, DocumentBlock union, GenerateNotesRequest
│   └── utils.ts    # cn() Tailwind class merge helper
│
├── public/         # Static assets (icons, apple-icon, etc.)
├── next.config.mjs
└── package.json
```

---

## Architecture

```
Browser
  │
  ├─→ /login         LoginForm
  │     ├─→ Google OAuth  ──────────────────→ Spring Boot /api/oauth2/authorization/google
  │     └─→ Email OTP     ──────────────────→ Spring Boot /api/otp/sender
  │                                           Spring Boot /api/auth/login
  │
  └─→ / (home)       AuthGuard
        │               └─→ Spring Boot /api/profile  (session cookie check)
        └─→ NotesStudio
              └─→ GenerateForm
                    └─→ LangChain Bot /api/v1/aiNotes?topic=&level=&exam_type=
                          └─→ NotesDocument JSON → DocumentView
```

The frontend calls the LangChain bot directly from the browser. If you run into CORS issues, proxy the request through the Spring Boot backend instead.

---

## Services

| Service | URL |
|---|---|
| Frontend | https://examnotes-ai-frontend.onrender.com |
| Spring Boot backend | https://examnotes-ai-springboot-backend.onrender.com |
| LangChain AI bot | https://examnotes-ai-langchain-bot.onrender.com |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm)
- The Spring Boot backend and LangChain bot running (locally or on Render)

### Installation

```bash
git clone https://github.com/Divyansh1802/ExamNotes-ai-Frontend.git
cd ExamNotes-ai-Frontend
pnpm install
```

### Environment

The backend URLs are currently hardcoded in `lib/api.ts`. To configure them via environment variables, create a `.env.local` file:

```env
NEXT_PUBLIC_SPRING_URL=https://examnotes-ai-springboot-backend.onrender.com
NEXT_PUBLIC_AI_BOT_URL=https://examnotes-ai-langchain-bot.onrender.com
```

Then update the `ENDPOINTS` object in `lib/api.ts` to read from `process.env.NEXT_PUBLIC_*`.

### Running locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** Login requires the Spring Boot backend to be reachable. Google OAuth also requires the OAuth2 redirect URI to be configured correctly in your Google Cloud Console.

---

## API Contract

### Notes generation

`POST https://examnotes-ai-langchain-bot.onrender.com/api/v1/aiNotes`

Query parameters:

| Param | Type | Example |
|---|---|---|
| `topic` | string | `Photosynthesis` |
| `level` | string | `Grade 10` |
| `exam_type` | string | `Board Exam` |

The bot returns either a bare `NotesDocument` or an envelope `{ success, message, data: NotesDocument }` — both are handled in `notes-studio.tsx`.

### NotesDocument shape

```ts
interface NotesDocument {
  documentId?: string
  title: string
  summary?: string
  metadata?: { topic: string; author: string; version: string }
  blocks: DocumentBlock[]   // heading | paragraph | image | chart | table | code | quote | list
  references?: { title: string; url: string }[]
}
```

---

## Related Repositories

- **Spring Boot backend** — handles auth (Google OAuth2 + OTP), session management, and acts as a proxy layer
- **LangChain AI bot** — Python/FastAPI service that generates the structured `NotesDocument` JSON
