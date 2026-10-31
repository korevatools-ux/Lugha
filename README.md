# Lugha

Lugha is a full-stack product starter built as a monorepo with a modern web app and API.

## Stack

- Frontend: Next.js + TypeScript + Tailwind-ready styling
- API: Express + TypeScript
- Shared UI: local workspace package
- Tooling: npm workspaces, ESLint, TypeScript

## Repositories and apps

- `apps/web` — Next.js storefront / dashboard frontend
- `apps/api` — Express API server
- `packages/ui` — shared UI components

## Quick start

1. Install dependencies:
   npm install
2. Copy environment variables:
   cp .env.example .env
3. Start the app:
   npm run dev

This runs the web app and API in parallel.

## Available commands

- `npm run dev` — run both apps
- `npm run build` — build web app and API
- `npm run lint` — lint both apps
- `npm run start:web` — start the frontend production build
- `npm run start:api` — start the API production build

## Default URLs

- Web app: http://localhost:3000
- API: http://localhost:4000

## Development notes

- Use the root `.env` file to override local environment settings.
- The API is intentionally simple and can be expanded with authentication, database integrations, and business logic.
