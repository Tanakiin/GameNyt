export function FeatureGrid() {
  const features = [
    {
      title: 'One place for your library',
      body: 'Sync Steam, add non-Steam games manually, and keep everything in one clean view.',
    },
    {
      title: 'Know what is worth playing',
      body: 'Use your genres, play history, and session preferences to surface better choices.',
    },
    {
      title: 'Minimal, fast, useful',
      body: 'No clutter, no gimmicks, just a game hub that actually helps you decide.',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {features.map((feature) => (
        <div key={feature.title} className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6">
          <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-400">{feature.body}</p>
        </div>
      ))}
    </div>
  )
}