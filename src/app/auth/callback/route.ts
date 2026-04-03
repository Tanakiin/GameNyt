import { createClient } from '@/lib/supabase/server'
import { syncUserFromAuth } from '@/lib/auth/sync-user'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data } = await supabase.auth.exchangeCodeForSession(code)

    if (data.user) {
      await syncUserFromAuth(data.user)
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}