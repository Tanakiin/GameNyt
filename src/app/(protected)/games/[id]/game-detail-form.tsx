'use client'

import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { updateUserGameDetailsAction, type UpdateGameDetailState } from '@/app/actions/games'

type Props = {
  gameId: string
  status: string | null
  personalRating: number | null
  notes: string | null
}

const initialState: {
  error?: string
  success?: boolean
} = {}

export function GameDetailForm({
  gameId,
  status,
  personalRating,
  notes
}: Props) {
  const [state, formAction] = useActionState(updateUserGameDetailsAction, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="gameId" value={gameId} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/80">Status</span>
          <select
            name="status"
            defaultValue={status ?? 'UNPLAYED'}
            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400/40"
          >
            <option value="UNPLAYED">Unplayed</option>
            <option value="PLAYING">Playing</option>
            <option value="FINISHED">Finished</option>
            <option value="DROPPED">Dropped</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/80">Your rating</span>
          <input
            type="number"
            name="personalRating"
            min="0"
            max="10"
            step="0.1"
            defaultValue={personalRating ?? ''}
            placeholder="0 - 10"
            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/40"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-white/80">Notes</span>
        <textarea
          name="notes"
          rows={6}
          defaultValue={notes ?? ''}
          placeholder="Thoughts, backlog notes, multiplayer plans, completion goals..."
          className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/40"
        />
      </label>

      <div className="flex items-center justify-between gap-3">
        <StatusMessage
          error={typeof state?.error === 'string' ? state.error : undefined}
          success={Boolean(state?.success)}
        />
        <SubmitButton />
      </div>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Saving...' : 'Save changes'}
    </button>
  )
}

function StatusMessage({
  error,
  success
}: {
  error?: string
  success?: boolean
}) {
  if (error) {
    return <p className="text-sm text-red-300">{error}</p>
  }

  if (success) {
    return <p className="text-sm text-emerald-300">Saved successfully.</p>
  }

  return <div />
}