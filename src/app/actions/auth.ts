'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema, signupSchema } from '@/lib/validations/auth'
import { syncUserFromAuth } from '@/lib/auth/sync-user'

export type AuthFormState = {
  error?: string
  success?: string
}

export async function signupAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    username: formData.get('username'),
  })

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? 'Invalid form submission',
    }
  }

  const { email, password, username } = parsed.data
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/dashboard`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    await syncUserFromAuth(data.user)
  }

  revalidatePath('/', 'layout')

  if (data.session) {
    redirect('/dashboard')
  }

  return {
    success: 'Account created. Check your email to confirm your account.',
  }
}

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? 'Invalid form submission',
    }
  }

  const { email, password } = parsed.data
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    await syncUserFromAuth(data.user)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}