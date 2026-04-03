'use client'

import { useActionState } from 'react'
import { addManualGameAction, type AddGameState } from '@/app/actions/games'
import { AuthSubmitButton } from '@/components/auth/auth-submit-button'

type AddGameButtonProps = {
  rawgId: number
  source?: 'MANUAL' | 'EPIC' | 'CONSOLE' | 'OTHER'
}

const initialState: AddGameState = {}

export function AddGameButton({
  rawgId,
  source = 'MANUAL',
}: AddGameButtonProps) {
  const [state, formAction] = useActionState(addManualGameAction, initialState)

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="rawgId" value={rawgId} />
      <input type="hidden" name="source" value={source} />
      <AuthSubmitButton>Add to library</AuthSubmitButton>
      {state?.error ? <p className="text-xs text-red-400">{state.error}</p> : null}
      {state?.success ? <p className="text-xs text-emerald-400">{state.success}</p> : null}
    </form>
  )
}