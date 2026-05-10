# Frontend — Roomy Chats

This is the frontend for Roomy Chats, built with React + Vite + Tailwind CSS.

## Run locally

```bash
cd /Users/aakashkrsingh1/IdeaProjects/roomy-chats/front-chat
npm install
VITE_BACKEND_BASE_URL=http://localhost:8080 npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Notes

- The frontend expects the backend API at `VITE_BACKEND_BASE_URL`.
- For local testing with the included backend, use `http://localhost:8080`.
- If you want to permanently configure this for Vite, add a `.env` file with:

```env
VITE_BACKEND_BASE_URL=http://localhost:8080
```
