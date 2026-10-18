import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="content-panel" aria-labelledby="not-found-title">
      <p className="eyebrow">Oops!</p>
      <h1 id="not-found-title">That page is not here.</h1>
      <Link className="button button--primary" to="/">
        Return home
      </Link>
    </section>
  )
}
