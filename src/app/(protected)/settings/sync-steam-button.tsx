'use client'

import { useTransition } from 'react'
import { syncSteamLibraryAction } from '@/app/actions/steam'

export function SyncSteamButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await syncSteamLibraryAction()
          window.location.reload()
        })
      }}
      className="inline-flex h-11 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/12 px-4 text-sm font-medium text-cyan-200 transition hover:border-cyan-400/30 hover:bg-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? 'Syncing...' : 'Sync Steam library'}
    </button>
  )
}