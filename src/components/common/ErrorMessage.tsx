import { Link } from 'react-router-dom'

interface ErrorMessageProps {
  title: string
  message: string
  actionLabel?: string
  actionTo?: string
}

/** A simple, non-technical recovery state for expected browser-data problems. */
export function ErrorMessage({
  title,
  message,
  actionLabel = 'Return home',
  actionTo = '/',
}: ErrorMessageProps) {
  return (
    <section
      className="content-panel error-message"
      aria-labelledby="error-title"
    >
      <p className="eyebrow">Let’s get back on track</p>
      <h1 id="error-title">{title}</h1>
      <p>{message}</p>
      <Link className="button button--primary" to={actionTo}>
        {actionLabel}
      </Link>
    </section>
  )
}
