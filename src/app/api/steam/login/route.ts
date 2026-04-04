import { NextRequest, NextResponse } from 'next/server'
import { buildSteamOpenIdUrl, makeStateToken } from '@/lib/steam/openid'

export async function GET(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  if (!appUrl) {
    return NextResponse.json({ error: 'Missing NEXT_PUBLIC_APP_URL' }, { status: 500 })
  }

  const state = makeStateToken()
  const popup = request.nextUrl.searchParams.get('popup') === '1'

  const returnTo = new URL(`${appUrl}/api/steam/callback`)
  if (popup) {
    returnTo.searchParams.set('popup', '1')
  }

  const redirectUrl = buildSteamOpenIdUrl(returnTo.toString(), appUrl, state)

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