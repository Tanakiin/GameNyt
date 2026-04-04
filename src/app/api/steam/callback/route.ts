import { NextRequest, NextResponse } from 'next/server'
import { verifySteamOpenId, extractSteamIdFromClaimedId } from '@/lib/steam/openid'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

function popupResponse(appUrl: string, payload: { ok: boolean; error?: string }) {
  const html = `
    <!doctype html>
    <html>
      <body>
        <script>
          (function () {
            const payload = ${JSON.stringify(payload)};
            if (window.opener) {
              window.opener.postMessage(
                { source: 'steam-link', ...payload },
                ${JSON.stringify(appUrl)}
              );
            }
            window.close();
          })();
        </script>
        <p>You can close this window.</p>
      </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
  })
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const params = url.searchParams
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || url.origin
  const isPopup = params.get('popup') === '1'

  const returnedState = params.get('state')
  const cookieState = request.cookies.get('steam_oauth_state')?.value

  if (!returnedState || !cookieState || returnedState !== cookieState) {
    return isPopup
      ? popupResponse(appUrl, { ok: false, error: 'invalid_state' })
      : NextResponse.redirect(`${appUrl}/settings?steam_error=invalid_state`)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id || !user.email) {
    return isPopup
      ? popupResponse(appUrl, { ok: false, error: 'not_logged_in' })
      : NextResponse.redirect(`${appUrl}/login`)
  }

  const isValid = await verifySteamOpenId(params)

  if (!isValid) {
    return isPopup
      ? popupResponse(appUrl, { ok: false, error: 'verification_failed' })
      : NextResponse.redirect(`${appUrl}/settings?steam_error=verification_failed`)
  }

  const claimedId = params.get('openid.claimed_id')

  if (!claimedId) {
    return isPopup
      ? popupResponse(appUrl, { ok: false, error: 'missing_claimed_id' })
      : NextResponse.redirect(`${appUrl}/settings?steam_error=missing_claimed_id`)
  }

  const steamId = extractSteamIdFromClaimedId(claimedId)

  if (!steamId) {
    return isPopup
      ? popupResponse(appUrl, { ok: false, error: 'invalid_steam_id' })
      : NextResponse.redirect(`${appUrl}/settings?steam_error=invalid_steam_id`)
  }

  const currentUser = await prisma.user.findFirst({
    where: {
      OR: [{ authUserId: user.id }, { email: user.email }],
    },
  })

  if (!currentUser) {
    return isPopup
      ? popupResponse(appUrl, { ok: false, error: 'user_not_found' })
      : NextResponse.redirect(`${appUrl}/settings?steam_error=user_not_found`)
  }

  const existingBySteamId = await prisma.linkedAccount.findFirst({
    where: {
      provider: 'STEAM',
      providerUserId: steamId,
    },
  })

  if (existingBySteamId && existingBySteamId.userId !== currentUser.id) {
    return isPopup
      ? popupResponse(appUrl, { ok: false, error: 'already_linked' })
      : NextResponse.redirect(`${appUrl}/settings?steam_error=already_linked`)
  }

  const existingForUser = await prisma.linkedAccount.findFirst({
    where: {
      userId: currentUser.id,
      provider: 'STEAM',
    },
  })

  if (existingForUser) {
    await prisma.linkedAccount.update({
      where: { id: existingForUser.id },
      data: {
        providerUserId: steamId,
        profileUrl: claimedId,
      },
    })
  } else {
    await prisma.linkedAccount.create({
      data: {
        userId: currentUser.id,
        provider: 'STEAM',
        providerUserId: steamId,
        profileUrl: claimedId,
      },
    })
  }

  const response = isPopup
    ? popupResponse(appUrl, { ok: true })
    : NextResponse.redirect(`${appUrl}/settings?steam_linked=1`)

  response.cookies.set('steam_oauth_state', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  return response
}