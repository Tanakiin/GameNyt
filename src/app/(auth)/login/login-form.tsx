'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { loginAction, type AuthFormState } from '@/app/actions/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthSubmitButton } from '@/components/auth/auth-submit-button'

const initialState: AuthFormState = {}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState)

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Your password"
          autoComplete="current-password"
          required
        />
      </div>

      {state?.error ? <p className="text-sm text-red-400">{state.error}</p> : null}

      <AuthSubmitButton>Log in</AuthSubmitButton>

      <p className="text-center text-sm text-neutral-400">
        Need an account?{' '}
        <Link href="/signup" className="text-white hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  )
}