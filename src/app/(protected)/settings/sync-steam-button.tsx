'use client'

import { useState } from 'react'
import { syncSteamLibraryAction } from '@/app/actions/steam'
import { Button } from '@/components/ui/button'

export function SyncSteamButton() {
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSync() {
    setPending(true)
    setMessage(null)
    setError(null)

    const result = await syncSteamLibraryAction()

    if (result.error) setError(result.error)
    if (result.success) setMessage(result.success)

    setPending(false)
  }

  return (
    <div className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Steam sync</h3>
        <p className="mt-1 text-sm text-neutral-400">
          Import owned Steam games, playtime, and last played data.
        </p>
      </div>

      <Button type="button" onClick={handleSync} disabled={pending}>
        {pending ? 'Syncing...' : 'Sync Steam library'}
      </Button>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
    </div>
  )
}