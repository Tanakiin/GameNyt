export default function RecommendationsPage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-500">Recommendations</p>
        <h2 className="text-3xl font-semibold tracking-tight">What should you play next?</h2>
      </div>

      <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/50 p-8 text-neutral-400">
        Your recommendation engine output will appear here once your library is populated.
      </div>
    </div>
  )
}