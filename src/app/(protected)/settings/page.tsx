export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-500">Settings</p>
        <h2 className="text-3xl font-semibold tracking-tight">Account and preferences</h2>
      </div>

      <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/50 p-8 text-neutral-400">
        Steam sync settings, genre preferences, and session preferences will live here.
      </div>
    </div>
  )
}