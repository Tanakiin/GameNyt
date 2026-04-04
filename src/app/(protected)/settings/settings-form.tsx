'use client'

import { useActionState } from 'react'
import { saveSettingsAction, type SettingsState } from '@/app/actions/settings'
import { AuthSubmitButton } from '@/components/auth/auth-submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initialState: SettingsState = {}

const GENRES = [
  'Action',
  'Adventure',
  'RPG',
  'Strategy',
  'Shooter',
  'Puzzle',
  'Simulation',
  'Indie',
  'Platformer',
  'Racing',
  'Sports',
  'Horror',
]

type SettingsFormProps = {
  username?: string | null
  preferredGenres?: string[]
  sessionLengthMinutes?: number | null
}

export function SettingsForm({
  username,
  preferredGenres = [],
  sessionLengthMinutes,
}: SettingsFormProps) {
  const [state, formAction] = useActionState(saveSettingsAction, initialState)

  const defaultSession =
    sessionLengthMinutes === 30 ? 'short'
      : sessionLengthMinutes === 90 ? 'medium'
      : sessionLengthMinutes === 180 ? 'long'
      : ''

  return (
    <form action={formAction} className="space-y-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" defaultValue={username ?? ''} placeholder="tanay" />
      </div>

      <div className="space-y-3">
        <Label>Preferred genres</Label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GENRES.map((genre) => (
            <label
              key={genre}
              className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-200"
            >
              <input
                type="checkbox"
                name="preferredGenres"
                value={genre}
                defaultChecked={preferredGenres.includes(genre)}
              />
              <span>{genre}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Typical session length</Label>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-neutral-200">
            <input type="radio" name="sessionLength" value="short" defaultChecked={defaultSession === 'short'} /> Short session
          </label>
          <label className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-neutral-200">
            <input type="radio" name="sessionLength" value="medium" defaultChecked={defaultSession === 'medium'} /> Medium session
          </label>
          <label className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-neutral-200">
            <input type="radio" name="sessionLength" value="long" defaultChecked={defaultSession === 'long'} /> Long session
          </label>
        </div>
      </div>

      {state.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-400">{state.success}</p> : null}

      <AuthSubmitButton>Save settings</AuthSubmitButton>
    </form>
  )
}