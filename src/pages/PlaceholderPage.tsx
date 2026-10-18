interface PlaceholderPageProps {
  title: string
  message: string
}

export function PlaceholderPage({ title, message }: PlaceholderPageProps) {
  return (
    <section className="content-panel" aria-labelledby="placeholder-title">
      <h1 id="placeholder-title">{title}</h1>
      <p>{message}</p>
    </section>
  )
}
