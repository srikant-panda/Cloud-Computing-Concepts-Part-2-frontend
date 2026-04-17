# Cloud Computing Concepts Part 2 - Frontend

React + Vite frontend for submitting learner details to a backend job runner, tracking submission progress, and handling cancellation.

## Stack

- React 19
- Vite 8
- Tailwind CSS 4
- Framer Motion
- Axios

## Features

- Submit form with email and token
- Async job tracking via polling
- Cancel active job from UI
- Auto-resume active job status after page reload
- Friendly API error messages (network, timeout, validation)
- Automatic cancel beacon on page exit while a job is active

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in this folder:

```bash
VITE_API_BASE_URL_1=http://localhost:8001
VITE_API_BASE_URL_2=http://localhost:8000
```

Optional fallbacks are also supported:

```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_API_BASE_URL_SEM3=http://localhost:8001
VITE_API_BASE_URL_SEM4=http://localhost:8000
```

If all API base URLs are empty, requests are sent to the same origin.

### 3. Run development server

```bash
npm run dev
```

## Available Scripts

- `npm run dev`: start local dev server
- `npm run build`: create production build
- `npm run preview`: preview production build locally
- `npm run lint`: run ESLint

## Deploy To Vercel

This project is configured for Vercel with [vercel.json](vercel.json):

- Build command: `npm run build`
- Output directory: `dist`
- Framework: `vite`
- SPA rewrite: all routes -> `index.html`

### Steps

1. Push this repository to GitHub (already done).
2. In Vercel, click **Add New... > Project** and import the repository.
3. Set the root directory to `frontend`.
4. Add environment variables:
	- `VITE_API_BASE_URL_1` = SEM-3 backend URL
	- `VITE_API_BASE_URL_2` = SEM-4 backend URL
	- Optional fallback: `VITE_API_BASE_URL`
5. Deploy.

After deployment, Vercel will rebuild automatically on new pushes to your default branch.

## API Contract

The app expects these backend endpoints:

- `POST /submit`
	- Request body: `{ "email": string, "token": string }`
	- Response: `{ "job_id": string }`
- `GET /status/:jobId`
	- Response shape includes `status` and optional `result`
	- Expected statuses: `running`, `grading`, `submitting`, `done`, `failed`, `killed`
- `POST /cancel/:jobId`
	- Cancels an active job

## State Persistence

- Form values are saved in localStorage
- Active `job_id` is saved and reused on reload
- Polling interval is 2 seconds

## Notes

- Request timeout is 5 minutes
- Leaving the page during an active submission triggers a cancel beacon
