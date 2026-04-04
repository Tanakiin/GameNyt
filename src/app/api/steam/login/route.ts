import { NextResponse } from 'next/server'
import { buildSteamOpenIdUrl, makeStateToken } from '@/lib/steam/openid'

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  if (!appUrl) {
    return NextResponse.json({ error: 'Missing NEXT_PUBLIC_APP_URL' }, { status: 500 })
  }

  const state = makeStateToken()
  const returnTo = `${appUrl}/api/steam/callback`
  const realm = appUrl
  const redirectUrl = buildSteamOpenIdUrl(returnTo, realm, state)

  const response = NextResponse.redirect(redirectUrl)

  response.cookies.set('steam_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10,
  })

  return response
}