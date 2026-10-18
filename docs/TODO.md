# Math Practice App - Implementation TODO

Only checked items have been completed and verified.

## Phase 1 - Project Setup

### 1. Create the React Project

- [x] Create the Vite React and TypeScript project.
- [x] Install project dependencies and verify the production build.
- [x] Remove default Vite demonstration content.
- [x] Create initial application folders for components, hooks, pages, services, utilities, types, and tests.

### 2. Configure Development Tools

- [x] Configure Oxlint and add a lint command.
- [x] Configure Prettier and add format/check commands.
- [x] Install and configure Vitest, jsdom, and React Testing Library.
- [x] Add and run one basic component test.

### 3. Define Shared TypeScript Types

- [x] Define operation, difficulty, question-source, session-length, and review-mode types.
- [x] Define question, practice-attempt, practice-session, and mistake-pattern interfaces.
- [x] Define statistics interfaces and empty-statistics constructors.
- [x] Define the application-settings interface.

## Remaining phases

- [ ] Phase 2 (tasks 4-6): shared page layout, home page, and routing.
- [ ] Phase 3 (tasks 7-10): operation/difficulty/session-length selectors and practice setup.
- [ ] Phase 4 (tasks 11-16): validated arithmetic question utilities and generators.
- [ ] Phase 5 (tasks 17-19): plausible distractors, unique choices, and shuffling.
- [ ] Phase 6 (tasks 20-25): answer choice and question-card front/back, selection, flip behavior, and animation.
- [ ] Phase 7 (tasks 26-31): practice-session state, results, progress, advancing, and continuous practice.
- [ ] Phase 8 (tasks 32-34): completion detection, summary, and summary actions.
- [ ] Phase 9 (tasks 35-39): resilient versioned local-storage service and persistence.
- [ ] Phase 10 (tasks 40-47): calculations, statistics views, recent sessions, and reset.
- [ ] Phase 11 (tasks 48-50): settings, defaults, and clear-all-data flow.
- [ ] Phase 12 (tasks 51-53): mistake-pattern creation, update, and persistence.
- [ ] Phase 13 (tasks 54-57): nearby, reversed, and fact-family similar-question generation.
- [ ] Phase 14 (tasks 58-62): review setup, priority, review sessions, success tracking, and mastery.
- [ ] Phase 15 (tasks 63-65): advanced mistake statistics and details.
- [ ] Phase 16 (tasks 66-69): keyboard, screen-reader, reduced-motion, and visual accessibility work.
- [ ] Phase 17 (tasks 70-73): tablet/mobile/statistics responsive design and child-friendly feedback.
- [ ] Phase 18 (tasks 74-75): active-session recovery and navigation safety.
- [ ] Phase 19 (tasks 76-78): invalid-data, generation-failure, and user-facing error handling.
- [ ] Phase 20 (tasks 79-82): unit, component, integration, and accessibility testing.
- [ ] Phase 21 (tasks 83-85): rendering, history-size, and loading performance work.
- [ ] Phase 22 (tasks 86-89): privacy/browser checks, production build, and deployment.

## Agreed implementation decisions

- Multiple operation selections represent mixed practice; there is no separate competing Mixed operation.
- A session uses exactly one difficulty level.
- Statistics and mistake tracking follow the self-reported result; selected answers are retained for history.
- Addition and multiplication mistake patterns are canonicalized as commutative facts; subtraction and division are not.
