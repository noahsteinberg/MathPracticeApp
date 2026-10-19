interface AnswerChoiceProps {
  answer: number
  choiceNumber: number
  checked: boolean
  disabled: boolean
  onSelect: (answer: number) => void
}

export function AnswerChoice({
  answer,
  choiceNumber,
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
        data-choice-number={choiceNumber}
        checked={checked}
        disabled={disabled}
        onChange={() => onSelect(answer)}
      />
      <span>{answer}</span>
      {checked && (
        <span className="answer-choice__selected-label">Selected</span>
      )}
    </label>
  )
}
