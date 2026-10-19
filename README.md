# Math Practice App

A child-friendly React and TypeScript application for practicing addition, subtraction, multiplication, and division.

## Live application

Open the deployed app at [majestic-mermaid-a6a8a0.netlify.app](https://majestic-mermaid-a6a8a0.netlify.app).

## Features

- Multiple-choice arithmetic practice across four difficulty levels.
- Configurable fixed-length and continuous practice sessions.
- Question-card reveal interaction, supportive feedback, and keyboard answer shortcuts.
- End-of-session summaries, saved statistics, and persisted practice settings.
- Mistake tracking, mastery progress, and similar-question review sessions.
- Responsive, accessible layouts with reduced-motion and high-contrast support.
- Browser-local data storage: no account or server is required.

## Run locally

Prerequisite: install a current Node.js LTS release.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Quality checks

```bash
npm test
npm run lint
npm run format:check
npm run build
```

To inspect the production build locally:

```bash
npm run preview
```

## Deployment

The app is deployed on Netlify from the `main` branch using:

- Build command: `npm run build`
- Publish directory: `dist`

The `public/_redirects` rule provides the single-page-app fallback required for refreshing React Router routes such as `/statistics` and `/settings`.

## Project documentation

- [Software specification](docs/specification.md)
- [Implementation checklist](docs/TODO.md)
- [Development notes](docs/development-notes.md)
