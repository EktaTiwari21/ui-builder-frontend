# AGENTS.md — Autonomous UI Builder · Frontend

> Loaded automatically by Antigravity 2.0 and Claude Code at session start.
> This is the frontend repo. Backend lives in ui-builder-backend (separate repo).

---

## Project identity

| Field | Value |
|---|---|
| Project name | Autonomous UI Builder Agent — Frontend |
| Repo name | ui-builder-frontend |
| Author | Ekta Tiwari |
| PRD version | 1.0 — May 24, 2026 |
| Current phase | Phase 3 — Frontend ↔ Backend Integration |
| Previous phase | Phase 1 complete — all UI components built |
| Status | Active development |

---

## What this product does

An AI-powered platform that transforms natural language prompts into
production-ready React/Tailwind frontends.

**Core loop:** Prompt → Plan → Generate → Preview → Refine → Export

---

## Repository layout

Two independent repos — never mix concerns between them.

```
ui-builder-frontend/    ← You are working here (Phase 3)
ui-builder-backend/     ← FastAPI + AI orchestrator (Phase 2 — complete)
```

---

## What was built in Phase 1 (do not rebuild)

All of these already exist. Read before writing — never recreate:

```
app/
├── layout.tsx               ✅ Root layout with providers
├── page.tsx                 ✅ Landing page (hero, features, CTA)
├── dashboard/page.tsx       ✅ Project grid dashboard
├── workspace/page.tsx       ✅ New project workspace
├── workspace/[projectId]/   ✅ Existing project workspace
├── projects/page.tsx        ✅ Project management
└── settings/page.tsx        ✅ API keys + preferences

components/
├── ui/                      ✅ shadcn/ui primitives
├── workspace/PromptInput    ✅ Prompt textarea + submit
├── workspace/ChatRefinement ✅ Chat thread
├── workspace/WorkspaceLayout✅ Two-panel split layout
├── preview/LivePreview      ✅ Iframe renderer
├── preview/CodeEditor       ✅ Syntax-highlighted code view
├── preview/PreviewToolbar   ✅ Tab toggle + export button
├── dashboard/ProjectCard    ✅ Project thumbnail card
├── dashboard/ProjectGrid    ✅ Responsive card grid
├── dashboard/EmptyState     ✅ Empty CTA state
├── common/Navbar            ✅ Top navigation
├── common/Sidebar           ✅ Left navigation
└── common/LoadingSpinner    ✅ Loading indicator

lib/
├── api/mock.ts              ✅ Mock responses (Phase 1) — keep, do not delete
├── api/endpoints.ts         ✅ Endpoint constants
├── store/useProjectStore    ✅ Zustand project state
├── store/useGenerationStore ✅ Zustand generation state
├── store/useUIStore         ✅ Zustand UI state
└── utils/exportProject.ts   ✅ Zip download helper
```

---

## Phase 3 rules (replaces all Phase 1 rules)

1. **Real backend calls replace mocks.** `lib/api/mock.ts` stays as fallback
   but all active calls go through `lib/api/client.ts` → real backend.
   Toggle via `NEXT_PUBLIC_USE_MOCK=true` in `.env.local` to switch back.

2. **Backend URL from env only.** Never hardcode `localhost:8000`.
   Always read from `process.env.NEXT_PUBLIC_API_URL`.

3. **SSE streaming must update UI in real time.** Do not wait for full
   response — render each chunk as it arrives in the live preview.

4. **Light theme only.** Still no dark mode. No `dark:` Tailwind variants.

5. **No auth UI yet.** Authentication is deferred to a future phase.
   Assume a logged-in user for all flows.

6. **Preserve all Phase 1 components.** Do not refactor, rename, or
   restructure existing components during integration sessions.

7. **One file changed per session where possible.** Integration bugs are
   easiest to isolate when changes are small and focused.

---

## Environment variables

### `.env.local` (local development)
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_USE_MOCK=false
```

### Vercel (production — set after Railway deploy)
```env
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
NEXT_PUBLIC_USE_MOCK=false
```

---

## Backend API contract (what the frontend calls)

The backend is running at `NEXT_PUBLIC_API_URL`. All endpoints:

| Method | Path | Purpose | Auth required |
|---|---|---|---|
| GET | `/health` | Health check | No |
| POST | `/generate-ui` | Generate UI — returns SSE stream | Yes |
| POST | `/improve-ui` | Improve existing UI — SSE stream | Yes |
| GET | `/projects` | List user projects | Yes |
| GET | `/project/:id` | Single project | Yes |
| DELETE | `/project/:id` | Delete project | Yes |
| POST | `/export-project` | Export as zip | Yes |

### SSE event types from `/generate-ui`
```typescript
{ type: "plan",  content: "Planning your UI architecture..." }
{ type: "chunk", content: "export function HeroSection() {..." }
{ type: "done",  project_id: "uuid", total_tokens: 1240 }
{ type: "error", message: "Generation failed" }
```

### Request shapes
```typescript
// POST /generate-ui
{ prompt: string, style: "minimal"|"modern"|"corporate"|"playful", framework: "react-tailwind" }

// POST /improve-ui
{ project_id: string, instruction: string }

// POST /export-project
{ project_id: string }
```

---

## Files to create in Phase 3 (do not create until the session calls for it)

```
lib/api/client.ts        ← Session A: base fetch wrapper with env URL
lib/api/real.ts          ← Session B: real API call functions
lib/ai/stream.ts         ← Session C: SSE streaming handler
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 · App Router · React 19 · TypeScript |
| Styling | Tailwind CSS · shadcn/ui · Framer Motion |
| State | Zustand · React Context |
| API client | Native fetch (no axios) |
| SSE | fetch + ReadableStream (no EventSource — POST not supported) |
| Testing | Vitest · React Testing Library · Playwright |
| Deploy | Vercel |

---

## Integration session order (follow strictly)

| Session | File(s) changed | What it does |
|---|---|---|
| A | `lib/api/client.ts`, `lib/api/endpoints.ts` | Base fetch wrapper + env URL |
| B | `lib/api/real.ts`, `lib/store/useProjectStore.ts` | Real API calls for projects |
| C | `lib/ai/stream.ts`, `hooks/useGenerate.ts`, `components/workspace/PromptInput.tsx`, `components/preview/LivePreview.tsx` | SSE streaming end-to-end |
| D | All integration files | E2E manual test + bug fixes |

---

## SSE streaming implementation pattern

Because `/generate-ui` is a POST endpoint, use `fetch` with `ReadableStream`
— NOT `EventSource` (EventSource only supports GET):

```typescript
// lib/ai/stream.ts — correct pattern
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-ui`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt, style, framework }),
});

const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const text = decoder.decode(value);
  // parse SSE lines: text.split("\n").filter(l => l.startsWith("data:"))
}
```

---

## Code conventions (unchanged from Phase 1)

- TypeScript strict mode — no `any`, no implicit returns
- Named exports for all components (no default exports except page files)
- File naming: PascalCase for components, camelCase for hooks/utils
- Imports: absolute paths via `@/` alias
- CSS: Tailwind utility classes only — no custom CSS except `globals.css`
- JSDoc on all exported functions

---

## Performance targets (unchanged)

| Metric | Target |
|---|---|
| Initial page load | < 3 seconds |
| First SSE chunk visible | < 3 seconds after submit |
| Full UI generation | < 20 seconds |
| Live preview update lag | < 1 second per chunk |
| Export download | < 10 seconds |

---

## Security rules

- Never log prompt content or generated code to console in production
- API keys only in `.env.local` — never hardcoded
- `NEXT_PUBLIC_` prefix only for values safe to expose to the browser
- Backend URL is public — fine to expose via `NEXT_PUBLIC_API_URL`
- Never expose `SUPABASE_SERVICE_KEY` or AI API keys to the frontend

---

## Error handling pattern for API calls

```typescript
// Always wrap real API calls like this
try {
  const data = await getProjects();
  setProjects(data);
} catch (error) {
  if (error instanceof APIError && error.status === 401) {
    // handle auth error
  } else {
    toast({ title: "Failed to load projects", variant: "destructive" });
  }
}
```

---

## Commit message format

```
feat: wire real GET /projects replacing mock
feat: add SSE streaming to PromptInput
fix: handle SSE parse error for malformed chunks
chore: update AGENTS.md to Phase 3
```

---

## Agent behaviour guidelines

- **Always read existing files before editing.** Phase 1 components exist — extend, don't rebuild.
- **One session = one concern.** Session A touches API client only. Session C touches streaming only.
- **Never delete mock.ts.** Keep it as fallback — swap via env flag.
- **Do not refactor Phase 1 components** during integration. Fix integration bugs only.
- **When backend returns an error**, surface it via shadcn toast — never silently swallow.
- **Do not install new npm packages** without checking if fetch/built-ins already cover the need.

---

## Out of scope for Phase 3

- Authentication / login UI (Phase 4)
- Dark mode (Phase 4)
- GitHub export
- Voice prompts
- Figma integration
- Real-time collaboration
- Full-stack code generation