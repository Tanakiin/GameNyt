'use client'

import { Button } from '@/components/ui/button'
import { UnlinkSteamButton } from './unlink-steam-button'

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
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    function handler(event: MessageEvent) {
      if (event.origin !== window.location.origin) return
      if (!event.data || event.data.source !== 'steam-link') return

      if (event.data.ok) {
        setError(null)
        setMessage('Steam account linked successfully.')
        window.location.reload()
      } else {
        setMessage(null)
        setError(`Steam linking failed: ${event.data.error ?? 'unknown_error'}`)
      }
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  function openPopup() {
    const width = 600
    const height = 760
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    window.open(
      '/api/steam/login?popup=1',
      'steam-login',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    )
  }

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
            Last synced: <span className="text-neutral-200">{lastSyncedAt.toLocaleString()}</span>
          </p>
        ) : null}
      </div>

      <Button
          type="button"
          onClick={openPopup}
          className="!bg-white !text-black hover:!bg-neutral-200"
        >
          {linked ? 'Relink Steam account' : 'Link Steam account'}
      </Button>

      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  )
}