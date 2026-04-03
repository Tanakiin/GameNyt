'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { signupAction, type AuthFormState } from '@/app/actions/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthSubmitButton } from '@/components/auth/auth-submit-button'

const initialState: AuthFormState = {}

export function SignupForm() {
  const [state, formAction] = useActionState(signupAction, initialState)

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          placeholder="tanay"
          autoComplete="username"
          required
        />
      </div>

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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
        />
      </div>

      {state?.error ? <p className="text-sm text-red-400">{state.error}</p> : null}

      {state?.success ? <p className="text-sm text-emerald-400">{state.success}</p> : null}

      <AuthSubmitButton>Create account</AuthSubmitButton>

      <p className="text-center text-sm text-neutral-400">
        Already have an account?{' '}
        <Link href="/login" className="text-white hover:underline">
          Log in
        </Link>
      </p>
    </form>
  )
}