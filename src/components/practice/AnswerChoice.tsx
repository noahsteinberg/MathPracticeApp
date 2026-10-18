interface AnswerChoiceProps {
  answer: number
  checked: boolean
  disabled: boolean
  onSelect: (answer: number) => void
}

export function AnswerChoice({
  answer,
  checked,
  disabled,
  onSelect,
}: AnswerChoiceProps) {
  return (
    <label
      className={
        checked ? 'answer-choice answer-choice--selected' : 'answer-choice'
      }
    >
      <input
        type="radio"
        aria-label={`Answer ${answer}`}
        name="answer-choice"
        value={answer}
        checked={checked}
        disabled={disabled}
        onChange={() => onSelect(answer)}
      />
      <span>{answer}</span>
    </label>
  )
}
