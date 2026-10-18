import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <section className="hero-panel" aria-labelledby="home-title">
      <p className="eyebrow">Math practice for curious minds</p>
      <h1 id="home-title">Ready to grow your math skills?</h1>
      <p className="hero-copy">
        Pick what you want to practice, solve at your own pace, and celebrate
        every step forward.
      </p>
      <div className="hero-actions">
        <Link className="button button--primary" to="/setup">
          Start practice
        </Link>
        <Link className="button button--secondary" to="/statistics">
          View statistics
        </Link>
      </div>
    </section>
  )
}
