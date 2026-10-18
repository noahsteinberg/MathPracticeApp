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
