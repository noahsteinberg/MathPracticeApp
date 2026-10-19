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

## Phase 12 - Mistake Tracking

### 51-53. Create, Update, and Persist Mistake Patterns

- [x] Create a mistake pattern from every self-reported incorrect regular-practice question.
- [x] Canonicalize addition and multiplication patterns while preserving subtraction/division operand order.
- [x] Update existing patterns without duplication, reset their similar-answer progress, and persist validated patterns locally.

## Phase 13 - Similar Question Generation

### 54-57. Nearby, Reversed, and Fact-Family Questions

- [x] Generate valid nearby-number questions tied to a mistake pattern.
- [x] Generate reversed-operand questions only for addition and multiplication.
- [x] Generate inverse-operation fact-family questions for addition/subtraction and multiplication/division.
- [x] Generate complete review questions with four answer choices and unit-test each strategy.

## Phase 14 - Mistake Review Mode

### 58. Review Setup

- [x] Add regular-practice and mistake-review setup choices.
- [x] Disable mistake review with an explanation when no active patterns exist, and show the active-pattern count.

### 59. Review Priority

- [x] Prioritize frequent, recent, and less-successfully reviewed mistakes, with randomized exact ties.

### 60-62. Review Sessions, Success, and Mastery

- [x] Build review sessions from eligible active patterns, avoid repeating a pattern when alternatives exist, and retain each question's source pattern ID.
- [x] Record review outcomes against the original pattern and persist the result locally.
- [x] Increment similar-question success, reset it after a review mistake, and mark patterns mastered at the configured threshold.
- [x] Exclude mastered patterns from review while allowing a future regular-practice mistake to reactivate them.

## Phase 15 - Advanced Mistake Statistics

### 63-65. Insight Counts and Pattern Details

- [x] Show active/mastered pattern counts plus review-question totals and correct outcomes.
- [x] Identify tied most-missed operations and facts, sorted by incorrect count with an empty state.
- [x] Show separate active and mastered pattern details with incorrect count, mastery progress, and most-recent incorrect date.

## Phase 16 - Accessibility

### 66. Keyboard Navigation

- [x] Preserve semantic, tabbable native controls with visible focus indicators and native Enter/Space button behavior.
- [x] Add 1–4 answer-choice shortcuts without intercepting keyboard input in form controls.

### 67. Screen-Reader Support

- [x] Retain semantic headings, forms, navigation, and named answer controls.
- [x] Add polite, atomic announcements for new questions, revealed answers, and session progress.
- [x] Confirm no icon-only buttons currently require a separate accessible name.

### 68. Reduced Motion

- [x] Detect `prefers-reduced-motion` and disable card animation while preserving the card content transition.
- [x] Respect both the system preference and the saved card-animation setting.

### 69. Visual Accessibility

- [x] Keep high-contrast visible focus treatment and add forced-colors support.
- [x] Add a text selected-state indicator so selection is not communicated by color alone.
- [x] Keep text in scalable `rem`/`clamp` units and layouts fluid for 200% zoom and larger system font sizes.

## Phase 17 - Responsive Design and Polish

### 70. Tablet Layout

- [x] Keep practice content centered with large, easy-to-reach answer targets at tablet widths.
- [x] Add responsive tablet spacing and card sizing for portrait and landscape layouts.

### 71. Mobile Layout

- [x] Stack answer choices and summary actions on small screens, with fluid card widths and no horizontal page scrolling.
- [x] Keep mobile navigation, progress, and question text usable at narrow viewport widths.

### 72. Statistics Responsiveness

- [x] Stack statistics cards on small screens and preserve readable recent-session and mistake-detail content without overlap.

### 73. Child-Friendly Feedback

- [x] Show varied, positive feedback after a self-reported correct answer and supportive, non-shaming feedback after a mistake.
- [x] Persist a setting that lets learners turn feedback messages off.

## Phase 18 - Session Recovery and Navigation Safety

### 74. Persist an Active Session

- [x] Persist the unfinished setup, session progress, current question, and selected answer in validated app storage.
- [x] Restore an unfinished session after a refresh and clear its saved state when the session ends.

### 75. Protect Against Accidental Navigation

- [x] Warn before leaving an active session through app navigation or browser refresh/close.
- [x] Let the learner cancel and continue, or confirm leaving to clear the recoverable session; do not warn after completion.

## Phase 19 - Error Handling

### 76. Invalid Stored Data

- [x] Validate settings, attempts, sessions, active sessions, and mistake patterns, resetting only an affected invalid category.
- [x] Handle malformed JSON and unavailable/invalid records without crashing the application.

### 77. Question-Generation Failures

- [x] Validate generated questions, retry invalid or repeated output up to a fixed maximum, log development details, and use a safe fallback question.

### 78. User-Friendly Error Messages

- [x] Add a reusable non-technical recovery message with a safe route home/setup action.
- [x] Explain missing-session and unavailable-review states without exposing technical errors.

## Phase 20 - Testing

### 79. Unit Tests

- [x] Cover arithmetic/difficulty bounds, distractors and unique choices, statistics, mistake patterns/mastery, similar questions, and storage validation/serialization.
- [x] Cover invalid generated-question retries and fallback behavior.

### 80. Component Tests

- [x] Cover setup selection, card answer/flip/result behavior, session progress/completion, statistics display, and confirmation dialogs.

### 81. Integration Tests

- [x] Cover full addition, mixed-operation, continuous, incorrect/mistake-pattern, review/mastery, refresh-recovery, and statistics-reset flows.

### 82. Accessibility Tests

- [x] Cover keyboard answer selection, semantic screen-reader announcements, reduced-motion behavior, and an automated axe audit of the application home route.

## Phase 21 - Performance and Data Management

### 83. Optimize React Rendering

- [x] Memoize statistics, mistake-insight, and recent-session calculations; memoize repeated statistics/list presentation.
- [x] Keep question generation in state initialization/result handlers rather than normal render work.

### 84. Manage Large Practice Histories

- [x] Verify loading and aggregate calculation for 5,000 attempts, plus app-scoped local-storage usage measurement.
- [x] Limit detailed recent-session rendering to the newest five records while retaining all attempts for exact aggregate statistics.
- [x] Keep older attempt records because the measured test history remains manageable and archiving would reduce detail without a demonstrated storage constraint.

### 85. Improve Loading Performance

- [x] Lazy-load the Statistics and Settings routes with an accessible loading status.
- [x] Verify the production build emits separate deferred route chunks and audit dependencies/assets: no unused runtime dependency or external font/image asset is currently present.

## Phase 22 - Release Verification and Deployment

### 86. Privacy

- [x] Confirm application settings, practice history, sessions, attempts, and mistake patterns use browser `localStorage`; no account or backend service is used.
- [x] Confirm no runtime analytics, advertising, external fonts, or external image assets are included.
- [x] Explain that clearing application/browser site data removes saved progress.

### 87. Browser and Device Checks

- [x] Verify the published site in current Chrome, Firefox, Edge, and Safari.
- [x] Verify tablet and mobile layouts on a device or emulator.
- [x] Verify keyboard, zoom, and reduced-motion behavior in a browser.
- [x] Complete and record a slow-device check using CPU and network throttling.

### 88. Production Build

- [x] Run the complete automated test suite, lint, formatting check, and TypeScript/Vite production build.
- [x] Test the local production preview, including a direct `/statistics` route response.

### 89. Deployment

- [x] Add the Netlify SPA rewrite rule and verify Vite copies it to `dist/_redirects`.
- [x] Deploy `main` commit `d5bf46c` to Netlify with `npm run build` and `dist` as the publish directory.
- [x] Confirm Netlify processed the SPA redirect rule without errors.
- [x] Record the public deployment URL: https://majestic-mermaid-a6a8a0.netlify.app
- [x] Verify the published site's core practice, statistics, settings, and direct-route refresh behavior.

## Agreed implementation decisions

- Multiple operation selections represent mixed practice; there is no separate competing Mixed operation.
- A session uses exactly one difficulty level.
- Statistics and mistake tracking follow the self-reported result; selected answers are retained for history.
- Addition and multiplication mistake patterns are canonicalized as commutative facts; subtraction and division are not.
