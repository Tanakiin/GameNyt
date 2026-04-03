export default function LibraryPage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-500">Library</p>
        <h2 className="text-3xl font-semibold tracking-tight">Your games</h2>
      </div>

      <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/50 p-8 text-neutral-400">
        Your synced and manually added games will appear here.
      </div>
    </div>
  )
}