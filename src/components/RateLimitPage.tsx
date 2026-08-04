const RateLimitPage = () => {
  return (
    <section className="container px-4 py-20 flex flex-col items-center gap-6 text-center">
      <h1>We'll be right back</h1>
      <p className="text-xl">We're experiencing high traffic right now. Please try again later.</p>
      {/* TODO: update with real contact email */}
      <p className="text-secondary-100">
        If the issue persists, contact <a href="mailto:hello@pressstart.gg"
        className="link-primary">hello@pressstart.gg</a>.
      </p>
    </section>
  )
}

export default RateLimitPage;
