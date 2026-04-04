export function StatStrip() {
  const items = [
    { label: 'Steam sync', value: 'Automatic' },
    { label: 'Manual imports', value: 'Epic + Console' },
    { label: 'Recommendations', value: 'Deterministic' },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">{item.label}</p>
          <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
        </div>
      ))}
    </div>
  )
}