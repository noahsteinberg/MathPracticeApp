import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  clearAllApplicationData,
  loadSettings,
  saveSettings,
} from '../services/storage'
import type {
  AppSettings,
  DifficultyLevel,
  MathOperation,
  SessionLength,
} from '../types/math'

const operations: Array<{ value: MathOperation; label: string }> = [
  { value: 'addition', label: 'Addition' },
  { value: 'subtraction', label: 'Subtraction' },
  { value: 'multiplication', label: 'Multiplication' },
  { value: 'division', label: 'Division' },
]

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="setting-row">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} />
    </label>
  )
}

export function SettingsPage() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState(loadSettings)
  const updateSettings = (changes: Partial<AppSettings>) => {
    setSettings((current) => {
      const next = { ...current, ...changes }
      saveSettings(next)
      return next
    })
  }
  const toggleOperation = (operation: MathOperation) => {
    const next = settings.defaultOperations.includes(operation)
      ? settings.defaultOperations.filter((item) => item !== operation)
      : [...settings.defaultOperations, operation]
    if (next.length > 0) updateSettings({ defaultOperations: next })
  }
  const clearData = () => {
    if (
      !window.confirm(
        'Clear all saved settings, sessions, and practice history? This cannot be undone.',
      )
    )
      return
    clearAllApplicationData()
    setSettings(loadSettings())
    navigate('/')
  }

  return (
    <section className="settings-page" aria-labelledby="settings-title">
      <div className="page-heading">
        <p className="eyebrow">Make it yours</p>
        <h1 id="settings-title">Settings</h1>
      </div>
      <div className="settings-panel">
        <h2>Preferences</h2>
        <Toggle
          label="Sound effects"
          checked={settings.soundEffectsEnabled}
          onChange={() =>
            updateSettings({
              soundEffectsEnabled: !settings.soundEffectsEnabled,
            })
          }
        />
        <Toggle
          label="Card animations"
          checked={settings.cardAnimationsEnabled}
          onChange={() =>
            updateSettings({
              cardAnimationsEnabled: !settings.cardAnimationsEnabled,
            })
          }
        />
        <Toggle
          label="Feedback messages"
          checked={settings.feedbackEffectsEnabled}
          onChange={() =>
            updateSettings({
              feedbackEffectsEnabled: !settings.feedbackEffectsEnabled,
            })
          }
        />
        <Toggle
          label="Show explanations"
          checked={settings.showExplanations}
          onChange={() =>
            updateSettings({ showExplanations: !settings.showExplanations })
          }
        />
        <h2>Practice defaults</h2>
        <label>
          Default session length
          <select
            aria-label="Default session length"
            value={settings.defaultSessionLength}
            onChange={(event) =>
              updateSettings({
                defaultSessionLength: (event.target.value === 'continuous'
                  ? 'continuous'
                  : Number(event.target.value)) as SessionLength,
              })
            }
          >
            <option value="5">5 questions</option>
            <option value="10">10 questions</option>
            <option value="20">20 questions</option>
            <option value="continuous">Continuous</option>
          </select>
        </label>
        <label>
          Default difficulty
          <select
            aria-label="Default difficulty"
            value={settings.defaultDifficulty}
            onChange={(event) =>
              updateSettings({
                defaultDifficulty: Number(
                  event.target.value,
                ) as DifficultyLevel,
              })
            }
          >
            {[1, 2, 3, 4].map((level) => (
              <option key={level} value={level}>
                Level {level}
              </option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend>Default operations</legend>
          {operations.map((operation) => (
            <label className="setting-row" key={operation.value}>
              <span>{operation.label}</span>
              <input
                aria-label={`Default ${operation.label}`}
                type="checkbox"
                checked={settings.defaultOperations.includes(operation.value)}
                onChange={() => toggleOperation(operation.value)}
                disabled={
                  settings.defaultOperations.length === 1 &&
                  settings.defaultOperations.includes(operation.value)
                }
              />
            </label>
          ))}
        </fieldset>
        <label>
          Correct similar answers for mastery
          <input
            aria-label="Mastery threshold"
            type="number"
            min="1"
            value={settings.masteryThreshold}
            onChange={(event) =>
              updateSettings({
                masteryThreshold: Math.max(1, Number(event.target.value) || 1),
              })
            }
          />
        </label>
        <button
          className="button button--secondary"
          type="button"
          onClick={clearData}
        >
          Clear all application data
        </button>
      </div>
    </section>
  )
}
