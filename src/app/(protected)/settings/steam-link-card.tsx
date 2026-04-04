'use client'

import React, { useEffect, useState } from 'react'
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
  const [buttonImageBroken, setButtonImageBroken] = useState(false)

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
          Link your Steam account with OpenID to sync owned games, playtime, and last played data.
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

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={openPopup}
          className="overflow-hidden rounded-md border border-neutral-700 bg-transparent transition hover:opacity-90"
          aria-label={linked ? 'Relink Steam account' : 'Link Steam account'}
          title={linked ? 'Relink Steam account' : 'Link Steam account'}
        >
          {!buttonImageBroken ? (
            <img
              src="/steam/sits_large_border.png"
              alt={linked ? 'Relink Steam account' : 'Sign in through Steam'}
              className="block h-auto w-[180px]"
              onError={() => setButtonImageBroken(true)}
            />
          ) : (
            <span className="inline-flex h-11 items-center justify-center px-4 text-sm font-medium text-white">
              {linked ? 'Relink Steam account' : 'Sign in through Steam'}
            </span>
          )}
        </button>

        {linked ? <UnlinkSteamButton /> : null}
      </div>

      <p className="text-xs text-neutral-500">
        Put Valve’s official button image at <code className="text-neutral-300">public/steam/sits_large_border.png</code>.
      </p>

      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  )
}