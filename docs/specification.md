# Math Practice App - Software Specification

## Product

A browser-based React application for children ages 7-12 to practice addition, subtraction, multiplication, and division. No account or backend is required; progress is stored only in browser local storage.

## Core experience

- Students choose one or more operations, one difficulty level, a session length (5, 10, 20, or continuous), and either regular or mistake-review practice.
- Each question is a card with exactly four shuffled, unique multiple-choice answers. A student selects an answer, flips the card to reveal the correct answer and selected answer, then self-reports `I Got It Right` or `I Got It Wrong`.
- A result is recorded exactly once, then the next question appears. Fixed sessions end with a summary; continuous sessions have an End Session action.
- Incorrect results create or update mistake patterns. Review sessions generate valid related questions and track mastery after a configurable number of correct similar questions (default: three).

## Pages

1. Home: child-friendly introduction and links to start practice, statistics, and settings.
2. Practice setup: operation, difficulty, session length, and regular/review-mode configuration.
3. Practice: question card, answer selection, flip state, progress, and result actions.
4. Session summary: attempted, correct, incorrect, accuracy, selected operations/difficulty, and next actions.
5. Statistics: overall, by operation, by difficulty, recent sessions, and mistake-review insights.
6. Settings: sound, animations, explanations, default configuration, mastery threshold, and clear-data action.

## Difficulty constraints

| Level          | Addition / subtraction                                                        | Multiplication                 | Division                                                                          |
| -------------- | ----------------------------------------------------------------------------- | ------------------------------ | --------------------------------------------------------------------------------- |
| 1 Beginner     | operands 0-10; addition result <=20; no negative subtraction                  | factors 0-5                    | divisors 1-5; whole-number answers                                                |
| 2 Easy         | operands 0-50; addition result <=100; no negative subtraction                 | factors 0-10                   | divisors 1-10; whole-number answers                                               |
| 3 Intermediate | operands 0-100; no negative subtraction by default                            | one-digit by one- or two-digit | divisors 1-12; dividend <=144; whole-number answers                               |
| 4 Advanced     | operands up to 1,000; negative subtraction is optional and excluded initially | two-digit by one- or two-digit | larger whole-number division; exact bounds will be documented with implementation |

Division must never divide by zero or generate fractional answers in the initial release. Question generation must validate bounds, avoid invalid subtraction/division, and avoid immediate repeats.

## Data and persistence

The shared TypeScript models are `Question`, `PracticeAttempt`, `PracticeSession`, `MistakePattern`, and `AppSettings`. Attempts preserve both the selected answer and the student's self-reported outcome. Statistics and mistake tracking use the self-reported outcome, as required by the interaction design.

Local storage will persist settings, attempts, completed sessions, mistake patterns, and any active session. It must use an application-specific key prefix, schema versioning, validation, JSON-error handling, unavailable-storage handling, and targeted recovery for invalid records.

For addition and multiplication, commutative facts should be normalized when matching mistake patterns; subtraction and division must retain operand order.

## Quality requirements

- Child-friendly, responsive interface with large touch targets and supportive feedback.
- Semantic controls, visible focus, keyboard support (including answer keys 1-4), screen-reader announcements, adequate contrast, and reduced-motion support.
- Unit tests for generators, choices, statistics, storage, mistake generation, and mastery; component and integration tests for key user flows.
- Privacy: no account, personal-data collection, advertising, or unnecessary tracking.
- Production readiness: current browsers, responsive layouts, optimized bundle, local production-build validation, and public deployment.

## Source note

This project-local version preserves the supplied requirements in implementation-ready form. The supplied reference transcript PDF remains at the project root as `cursor_math_practice_full_transcript.pdf`.
