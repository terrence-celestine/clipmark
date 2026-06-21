# ClipMark

**Mark what matters.**

ClipMark is a YouTube video bookmarking app that lets you mark personal chapters at any timestamp, add notes, and jump back to exactly what you wanted to remember. No more scrubbing through hour-long videos trying to find that one part.

🔗 [clipmark.theteecee.dev](https://clipmark.theteecee.dev)

---

## Features

- **Custom chapters** — press `T` while watching to drop a chapter at the current timestamp
- **Chapter notes** — add context to each chapter so you remember why it mattered
- **Seek on click** — click any chapter in the sidebar to jump straight to that moment
- **Collections** — group videos by topic (e.g. React tutorials, Interview prep)
- **Progress tracking** — resumes from where you left off, marks videos as completed
- **Fully local** — all data stored in your browser via IndexedDB, no account required
- **Responsive** — works on desktop and mobile with a bottom nav on small screens

---

## Stack

| Layer     | Tech                         |
| --------- | ---------------------------- |
| Framework | React 19 + TypeScript + Vite |
| Styling   | Tailwind v4                  |
| Routing   | React Router v7              |
| Database  | Dexie.js (IndexedDB)         |
| Player    | react-player                 |
| Icons     | Lucide React                 |
| Deploy    | Vercel                       |

---

## Getting started

```bash
# clone the repo
git clone https://github.com/terrence-celestine/clipmark.git
cd clipmark

# install dependencies
npm install

# start the dev server
npm run dev
```

Open [localhost:5173](http://localhost:5173) and add your first YouTube video.

---

## How it works

ClipMark embeds YouTube videos via react-player and tracks playback time locally. When you press `T`, it captures the current timestamp and opens a form to name the chapter. Chapters are stored in IndexedDB using Dexie.js — no backend, no auth, no data leaves your browser.

On the home screen, videos are organised by collection with a filter strip. The resume bar surfaces the last video you were watching so you can pick up where you left off.

---

## Project structure

```
src/
├── components/
│   ├── home/          # VideoCard, ResumeBar, CategoryStrip, modals
│   ├── layout/        # TopNav, BottomNav, AppLayout
│   └── watch/         # YouTubePlayer, ChapterSidebar, NewChapterForm
├── db/                # Dexie schema, helpers, seed
├── hooks/             # (reserved for future hooks)
├── pages/             # Home, Watch
└── types/             # Shared TypeScript interfaces
```

---

## Roadmap

- [ ] Search across videos, chapters, and notes
- [ ] Export chapters as a shareable list with deep links
- [ ] Import YouTube creator chapters as a starting point
- [ ] Dark mode
- [ ] PWA support for mobile install

---

Built by [Terrence Celestine](https://theteecee.dev)
