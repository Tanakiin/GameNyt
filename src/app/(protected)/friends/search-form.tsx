'use client'

import { useActionState } from 'react'
import { sendFriendRequestAction, type FriendActionState } from '@/app/actions/friends'

const initialState: FriendActionState = {}

export function FriendSearchForm() {
  const [state, formAction] = useActionState(sendFriendRequestAction, initialState)

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5">
      <h2 className="text-lg font-semibold text-white">Add a friend</h2>
      <p className="mt-1 text-sm text-neutral-500">
        Search by GameNight username or email.
      </p>

      <form action={formAction} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          name="query"
          placeholder="username or email"
          className="h-11 flex-1 rounded-xl border border-neutral-700 bg-black px-4 text-white outline-none"
        />
        <button
          type="submit"
          className="h-11 rounded-xl bg-cyan-400 px-4 text-sm font-medium text-slate-950"
        >
          Send request
        </button>
      </form>

      {state.error ? <p className="mt-3 text-sm text-red-400">{state.error}</p> : null}
      {state.success ? <p className="mt-3 text-sm text-emerald-400">{state.success}</p> : null}
    </div>
  )
}