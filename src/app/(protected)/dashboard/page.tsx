export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-neutral-500">Dashboard</p>
        <h2 className="text-3xl font-semibold tracking-tight">Overview</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-sm text-neutral-400">Total games</p>
          <p className="mt-2 text-3xl font-semibold">0</p>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-sm text-neutral-400">Total playtime</p>
          <p className="mt-2 text-3xl font-semibold">0h</p>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-sm text-neutral-400">Unplayed backlog</p>
          <p className="mt-2 text-3xl font-semibold">0</p>
        </div>
      </div>
    </div>
  )
}