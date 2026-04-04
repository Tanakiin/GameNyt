'use client'

import { useState } from 'react'
import { unlinkSteamAccountAction } from '@/app/actions/steam'
import { Button } from '@/components/ui/button'

export function UnlinkSteamButton() {
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleUnlink() {
    const confirmed = window.confirm('Unlink your Steam account from GameNight?')
    if (!confirmed) return

    setPending(true)
    setMessage(null)
    setError(null)

    const result = await unlinkSteamAccountAction()

    if (result.error) {
      setError(result.error)
    } else if (result.success) {
      setMessage(result.success)
      window.location.reload()
    }

    setPending(false)
  }

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" onClick={handleUnlink} disabled={pending}>
        {pending ? 'Unlinking...' : 'Unlink Steam'}
      </Button>

      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  )
}