type SteamLinkCardProps = {
  linked: boolean
  steamId?: string | null
  lastSyncedAt?: Date | null
}

export function SteamLinkCard({
  linked,
  steamId,
  lastSyncedAt,
}: SteamLinkCardProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Steam account</h3>
        <p className="mt-1 text-sm text-neutral-400">
          Link your Steam account directly instead of pasting a profile URL.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3">
        <p className="text-sm text-neutral-400">
          Status: <span className="text-neutral-200">{linked ? 'Linked' : 'Not linked'}</span>
        </p>

        {steamId ? (
          <p className="mt-2 text-sm text-neutral-400">
            SteamID: <span className="text-neutral-200">{steamId}</span>
          </p>
        ) : null}

        {lastSyncedAt ? (
          <p className="mt-2 text-sm text-neutral-400">
            Last synced:{' '}
            <span className="text-neutral-200">{lastSyncedAt.toLocaleString()}</span>
          </p>
        ) : null}
      </div>

        <a
          href="/api/steam/login"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-100 px-4 text-sm font-medium text-black transition hover:bg-neutral-200"
        >
          {linked ? 'Relink Steam account' : 'Link Steam account'}
        </a>
    </div>
  )
}