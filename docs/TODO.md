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

## Phase 2 - Basic Interface

### 4. Create the Shared Page Layout

- [x] Create the shared application shell with a branded header and semantic main-content area.
- [x] Add responsive navigation with active-route styling for Home, Practice, Statistics, and Settings.
- [x] Add responsive, child-friendly baseline styles and visible focus indicators.

### 5. Create the Home Page

- [x] Add a child-friendly welcome message.
- [x] Add Start Practice and View Statistics actions.

### 6. Add Application Routing

- [x] Configure React Router routes for home, setup, practice, statistics, settings, and unknown paths.
- [x] Add safe placeholder pages for later-phase features without implementing their functionality.

## Phase 3 - Practice Configuration

### 7. Create the Operation Selector

- [x] Provide selectable addition, subtraction, multiplication, and division controls.
- [x] Support selecting one or more operations, plus Select all and Clear selection actions.

### 8. Create the Difficulty Selector

- [x] Provide one accessible radio selection for each of the four difficulty levels.

### 9. Create the Session-Length Selector

- [x] Provide 5, 10, 20, and continuous-practice choices.

### 10. Build the Practice Setup Page

- [x] Combine all configuration selectors in a responsive form.
- [x] Keep Start Practice disabled until operations, one difficulty, and a session length are selected.
- [x] Hand the validated configuration to the practice route, which remains a clearly labeled Phase 7 placeholder.

## Remaining phases

## Phase 4 - Basic Math Question Generation

### 11. Create General Question Utilities

- [x] Add random-number, shuffle, and operation-symbol utilities.
- [x] Give generated questions IDs, display text, correct answers, difficulty, and a regular-practice source.

### 12-15. Implement Arithmetic Questions

- [x] Generate addition within each documented difficulty range.
- [x] Generate subtraction without negative answers.
- [x] Generate multiplication using the documented factor ranges.
- [x] Generate whole-number division without division by zero.

### 16. Create the Main Question Generator

- [x] Create operation-specific questions and a complete-question helper that adds answer choices.

## Phase 5 - Multiple-Choice Answers

### 17-19. Generate and Shuffle Answer Choices

- [x] Generate three unique, non-negative distractors that differ from the correct answer.
- [x] Apply operation-specific distractor strategies for all four operations.
- [x] Shuffle the correct answer with distractors into four choices.

## Phase 6 - Question Card

### 20-25. Answer Choices and Card Interaction

- [x] Create accessible, selectable answer-choice controls.
- [x] Build the question-card front with four answers and a disabled-until-selected Flip Card button.
- [x] Show the original question, selected answer, correct answer, and right/wrong actions on the back.
- [x] Prevent answer changes after flipping, record one self-reported result, and reset the card when its question changes.
- [x] Add card-reveal animation with reduced-motion support and an animation-disable component prop.

## Remaining phases

## Phase 7 - Practice Session

### 26-29. Session State, Results, and Advancement

- [x] Create in-memory session state with an ID, setup configuration, counts, current question number, and completed attempts.
- [x] Start from validated setup data and redirect to setup when it is unavailable.
- [x] Record one self-reported result per card and update session totals.
- [x] Advance automatically to a newly generated question, reset the card, and avoid immediately repeating a question.

### 30-31. Progress and Continuous Practice

- [x] Show accessible Question X of Y progress for fixed-length sessions.
- [x] Hide fixed progress for continuous practice and show completed-question count instead.
- [x] Support ending continuous practice, with confirmation after at least one attempt.

## Phase 8 - Session Summary

### 32-34. Completion, Summary, and Actions

- [x] Complete fixed sessions at the configured length, timestamp completion, and navigate to the summary.
- [x] Display attempted, correct, incorrect, accuracy, operations, difficulty, and mistake-review count.
- [x] Provide Practice Again, Change Settings, View Statistics, and Return Home actions.
- [x] Show a disabled Practice Mistakes action until mistake-review mode is implemented in Phase 14.

## Remaining phases

## Phase 9 - Local Data Storage

### 35-36. Storage Service and Schema Versioning

- [x] Add an application-prefixed local-storage wrapper for JSON reads, writes, deletion, and storage failures.
- [x] Recover from malformed JSON and invalid saved records without crashing.
- [x] Store an application schema version and reserve a migration point that does not affect unrelated browser data.

### 37-39. Persist Settings, Sessions, and Attempts

- [x] Persist validated settings and recover to defaults when saved settings are missing or invalid.
- [x] Save completed sessions and load recent sessions for statistics.
- [x] Save completed attempts with selected answer, self-reported result, operation, difficulty, session ID, and timestamp.

## Phase 10 - Statistics

### 40-42. Statistics Calculations

- [x] Calculate overall totals and zero-safe accuracy, with unit tests.
- [x] Calculate totals and accuracy by operation and difficulty.

### 43-47. Statistics Page and Reset

- [x] Display overall, operation, difficulty, and recent-session statistics with responsive cards and empty states.
- [x] Sort recent completed sessions newest first.
- [x] Add confirmed statistics reset that clears attempts/sessions while preserving settings.

## Phase 11 - Settings

### 48-50. Settings, Defaults, and Clear Data

- [x] Add persisted settings for sound, card animation, explanations, default session length/difficulty/operations, and mastery threshold.
- [x] Apply saved default practice configuration to the setup page while allowing per-session changes.
- [x] Add confirmed clear-all-data action that restores defaults and returns home.

## Remaining phases

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
