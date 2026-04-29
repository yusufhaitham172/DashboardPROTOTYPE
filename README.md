# QualityTrade — CRM Dashboard (Prototype)

This workspace contains a production-minded React + TypeScript prototype dashboard for QualityTrade.

Quick start

1. Install dependencies:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

Notes
- UI built with Vite, React, TypeScript, Tailwind CSS.
- Charts use `recharts` and state is managed with `zustand`.
- This scaffold contains mock data in `src/data/mock.ts` and reusable components in `src/components`.

Files of interest
- [src/App.tsx](src/App.tsx) — app routes and layout
- [src/pages/Dashboard.tsx](src/pages/Dashboard.tsx) — main dashboard
- [src/pages/Employees.tsx](src/pages/Employees.tsx) — employee management
- [src/store/useStore.ts](src/store/useStore.ts) — Zustand store

Next steps
- Install dependencies and iterate UI/UX polish, accessibility, and export functionality.
# DashboardPROTOTYPE