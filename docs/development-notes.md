# Development Notes

## Phase 2-3 - Navigation and practice setup

- Prompt focus: build only the shared layout, routing, and validated practice-configuration controls.
- Decision: the practice route intentionally displays a setup handoff/placeholder instead of starting a session; session state is Phase 7 work.
- Tests: navigation from Home to Setup, disabled submit for incomplete setup, and handoff of addition/Level 2/10-question configuration.
- Fixes: configured explicit test cleanup after a duplicate-render failure; added explicit accessible names to custom checkbox/radio inputs after label queries exposed missing accessible names.
- Commit: `ef38399 feat: add practice setup and navigation`.

## Phase 4-6 - Questions, choices, and cards

- Prompt focus: implement only generators, multiple-choice answers, and reusable card interactions; stop before session state.
- Decisions: division is generated from a divisor and whole-number quotient; mixed operations remain a setup selection, while this phase generates one requested operation at a time. Advanced division uses divisors up to 25 and quotients up to 40 pending any later product decision that narrows the specification.
- Tests: generated-question arithmetic and bounds across every operation/difficulty, unique four-choice answers, card selection/flip/reveal behavior, one-time self-reported result handling, reset on a new question, plus the existing route/setup tests.
- Fixes: replaced a synchronous state-reset effect (reported by lint) with a keyed card instance so new questions reset without an extra effect-driven render.
- Verification: `npm test` (7 passing), `npm run lint`, `npm run format:check`, and `npm run build` all pass.

## Phase 7-8 - Session flow and summaries

- Prompt focus: implement only in-memory session flow, progress, question advancement, continuous practice, and summaries; do not begin local-storage persistence.
- Decision: completed attempts remain in component memory and are intentionally not written to `localStorage`; Phase 9 will add the storage service. The summary receives its data through route state.
- Tests: full five-question session through a 100% summary and Practice Again; continuous session ended with zero attempts; confirmation when ending a continuous session with progress; no immediate repeated question signature.
- Fixes: narrowed one progress assertion after both the session landmark and progress element correctly exposed the same accessible question label.

## Phase 9-11 - Persistence, statistics, and settings

- Prompt focus: persist settings/attempts/completed sessions, add statistics and reset actions, and stop before mistake tracking.
- Decisions: storage uses an app-specific, versioned key namespace and validates every loaded record. Attempts are saved when results are recorded; completed sessions are saved only when a session finishes. Active-session recovery remains Phase 18.
- Tests: malformed-data recovery; settings/attempt/session persistence; history reset versus clear-all; aggregate statistics; settings changes; default application to setup; statistics display and reset.
- Fixes: replaced Node 25's file-backed test `localStorage` with a deterministic in-memory test storage shim, and made a statistics assertion target its containing card because the value is intentionally split into semantic elements.
- Verification: `npm test` (18 passing), `npm run lint`, `npm run format:check`, and `npm run build` all pass.

## Phase 12-13 - Mistake tracking and similar questions

- Prompt focus: record self-reported incorrect regular-practice results, persist mistake patterns, and create related questions; stop before review sessions and mastery tracking.
- Decisions: addition and multiplication patterns use sorted operands as their identity, while subtraction and division retain operand order. A repeat incorrect result increases its count and resets related-answer progress and mastery. Similar questions retain the source pattern ID and use the existing four-choice answer generator.
- Tests: pattern creation, commutative matching, repeat updates, persistence, nearby-number validity, reversal restrictions, all four inverse fact-family directions, complete review-card choices, and the Practice Page's incorrect-result integration path.
- Fixes: none required after implementation; initial test run passed with 26 tests.

## Phase 14-15 - Review sessions and mistake insights

- Prompt focus: implement review setup, priority, session/mastery behavior, and detailed mistake statistics; stop before accessibility work.
- Decisions: review eligibility is filtered by the selected operations and difficulty. Priority combines incorrect count, remaining successes to mastery, and recency; exact score ties are randomized. A review session ends early when all eligible patterns become mastered.
- Tests: setup's disabled review state, review-session mastery flow, priority inputs and ties, mastery/reopen transitions, advanced review statistics/ties, and the statistics-page detail display.
- Fixes: corrected two test selectors that initially targeted repeated labels rather than their containing summary/detail elements.
- Verification: `npm test` (34 passing), `npm run lint`, `npm run format:check`, and `npm run build` all pass.

## Phase 16 - Accessibility

- Prompt focus: improve keyboard access, screen-reader feedback, reduced-motion behavior, and visual accessibility; stop before responsive-design work.
- Decisions: number-key shortcuts are active only outside editable form controls, while semantic buttons retain native Enter/Space behavior. There are no icon-only buttons in the current interface. The card animation is disabled when either the saved setting is off or the operating-system motion preference requests reduction.
- Tests: number-key selection, editable-input shortcut protection, selected-state text, screen-reader question/reveal announcements, reduced-motion class behavior, and session-progress announcement coverage.
- Fixes: restored a click in one existing card test after jsdom did not emulate native focused-button Enter activation; browser-native button semantics remain unchanged.
- Verification: `npm test` (37 passing), `npm run lint`, `npm run format:check`, and `npm run build` all pass.

## Phase 17 - Responsive Design and Polish

- Prompt focus: implement tablet/mobile/statistics responsiveness and child-friendly feedback only; stop before active-session recovery.
- Decisions: responsive rules use 600px and 900px breakpoints, preserve a 320px minimum viewport, and stack dense actions/content at the narrowest widths. Feedback follows the existing self-reported outcome model, is deliberately brief and non-shaming, varies from a small message set, and can be disabled through persisted settings.
- Tests: deterministic positive/supportive feedback-message selection; correct and incorrect practice-result feedback; feedback-setting persistence and disabled-message behavior; existing session, statistics, and settings coverage remains in the suite.
- Fixes: added overflow-safe wrapping for long history/detail text and full-width narrow-screen controls to prevent layout spillover.
- Verification: `node .\\node_modules\\vitest\\vitest.mjs run --pool=forks --maxWorkers=1 --no-file-parallelism` (40 passing), `npm run lint`, `npm run format:check`, and `npm run build` pass. The serialized Vitest invocation avoids an intermittent local worker-startup timeout from the npm wrapper.
