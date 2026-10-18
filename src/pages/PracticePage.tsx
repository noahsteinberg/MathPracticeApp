import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { QuestionCard } from '../components/practice/QuestionCard'
import {
  activeMistakePatterns,
  selectReviewPattern,
  updatePatternAfterReview,
} from '../services/mistakeReview'
import { createSessionQuestion } from '../services/questionGenerator'
import { recordIncorrectQuestion } from '../services/mistakePatterns'
import { generateSimilarQuestion } from '../services/similarQuestionGenerator'
import {
  loadMistakePatterns,
  loadSettings,
  saveAttempt,
  saveMistakePatterns,
  saveSession,
} from '../services/storage'
import type {
  PracticeSession,
  PracticeAttempt,
  PracticeSetupConfig,
  Question,
  SessionSummaryData,
} from '../types/math'

interface PracticeLocationState {
  setup?: PracticeSetupConfig
}

function createSession(setup: PracticeSetupConfig): PracticeSession {
  return {
    id: crypto.randomUUID(),
    operations: setup.operations,
    difficulty: setup.difficulty,
    sessionLength: setup.sessionLength,
    startedAt: new Date().toISOString(),
    attemptedCount: 0,
    correctCount: 0,
    incorrectCount: 0,
    mistakeReviewCount: 0,
  }
}

function createReviewQuestion(
  setup: PracticeSetupConfig,
  previousQuestion?: Question,
): Question | null {
  const pattern = selectReviewPattern(loadMistakePatterns(), loadSettings(), {
    operations: setup.operations,
    difficulty: setup.difficulty,
    previousPatternId: previousQuestion?.mistakePatternId,
  })
  return pattern ? generateSimilarQuestion(pattern) : null
}

export function PracticePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as PracticeLocationState | null
  const setup = state?.setup

  if (!setup || setup.operations.length === 0) {
    return <Navigate to="/setup" replace />
  }

  const noReviewPatterns =
    setup.reviewMode === 'mistake-review' &&
    activeMistakePatterns(
      loadMistakePatterns(),
      setup.operations,
      setup.difficulty,
    ).length === 0
  if (noReviewPatterns) return <Navigate to="/setup" replace />

  return (
    <ActivePracticeSession
      key={location.key}
      setup={setup}
      onComplete={navigate}
    />
  )
}

interface ActivePracticeSessionProps {
  setup: PracticeSetupConfig
  onComplete: ReturnType<typeof useNavigate>
}

function ActivePracticeSession({
  setup,
  onComplete,
}: ActivePracticeSessionProps) {
  const [session, setSession] = useState(() => createSession(setup))
  const [question, setQuestion] = useState<Question>(() =>
    setup.reviewMode === 'mistake-review'
      ? (createReviewQuestion(setup) ??
        createSessionQuestion(setup.operations, setup.difficulty))
      : createSessionQuestion(setup.operations, setup.difficulty),
  )
  const [, setAttempts] = useState<PracticeAttempt[]>([])

  const finishSession = (completedSession: PracticeSession) => {
    const finishedSession = {
      ...completedSession,
      completedAt: new Date().toISOString(),
    }
    saveSession(finishedSession)
    const summary: SessionSummaryData = {
      setup,
      session: finishedSession,
    }
    onComplete('/summary', { state: { summary } })
  }

  const handleResult = ({
    selectedAnswer,
    selfReportedCorrect,
  }: {
    selectedAnswer: number
    selfReportedCorrect: boolean
  }) => {
    const updatedSession: PracticeSession = {
      ...session,
      attemptedCount: session.attemptedCount + 1,
      correctCount: session.correctCount + Number(selfReportedCorrect),
      incorrectCount: session.incorrectCount + Number(!selfReportedCorrect),
      mistakeReviewCount:
        session.mistakeReviewCount +
        Number(question.source === 'mistake-review'),
    }

    setSession(updatedSession)
    const attempt: PracticeAttempt = {
      id: crypto.randomUUID(),
      questionId: question.id,
      operation: question.operation,
      firstOperand: question.firstOperand,
      secondOperand: question.secondOperand,
      correctAnswer: question.correctAnswer,
      selectedAnswer,
      selfReportedCorrect,
      difficulty: question.difficulty,
      source: question.source,
      attemptedAt: new Date().toISOString(),
      sessionId: session.id,
      mistakePatternId: question.mistakePatternId,
    }
    setAttempts((currentAttempts) => [...currentAttempts, attempt])
    saveAttempt(attempt)
    if (!selfReportedCorrect && question.source === 'regular') {
      recordIncorrectQuestion(question)
    }
    if (question.source === 'mistake-review' && question.mistakePatternId) {
      const updatedPatterns = updatePatternAfterReview(
        loadMistakePatterns(),
        question.mistakePatternId,
        selfReportedCorrect,
        loadSettings().masteryThreshold,
      )
      saveMistakePatterns(updatedPatterns)
    }
    const isFixedSessionComplete =
      setup.sessionLength !== 'continuous' &&
      updatedSession.attemptedCount >= setup.sessionLength

    if (isFixedSessionComplete) {
      finishSession(updatedSession)
      return
    }

    if (setup.reviewMode === 'mistake-review') {
      const nextQuestion = createReviewQuestion(setup, question)
      if (!nextQuestion) {
        finishSession(updatedSession)
        return
      }
      setQuestion(nextQuestion)
      return
    }

    setQuestion((currentQuestion) =>
      createSessionQuestion(
        setup.operations,
        setup.difficulty,
        currentQuestion,
      ),
    )
  }

  const endContinuousSession = () => {
    if (
      session.attemptedCount > 0 &&
      !window.confirm('End this practice session and see your summary?')
    ) {
      return
    }
    finishSession(session)
  }

  const isContinuous = setup.sessionLength === 'continuous'
  const questionNumber = session.attemptedCount + 1

  return (
    <section className="practice-page" aria-labelledby="practice-heading">
      <div className="practice-status">
        <div>
          <p className="eyebrow">Practice time</p>
          <h1 id="practice-heading">
            {isContinuous
              ? `Questions completed: ${session.attemptedCount}`
              : `Question ${questionNumber} of ${setup.sessionLength}`}
          </h1>
        </div>
        {isContinuous ? (
          <button
            className="button button--secondary"
            type="button"
            onClick={endContinuousSession}
          >
            End session
          </button>
        ) : (
          <progress
            aria-label={`Question ${questionNumber} of ${setup.sessionLength}`}
            max={setup.sessionLength}
            value={session.attemptedCount}
          />
        )}
      </div>
      <QuestionCard
        question={question}
        animationsEnabled={loadSettings().cardAnimationsEnabled}
        onResult={handleResult}
      />
    </section>
  )
}
