import { NextRequest, NextResponse } from 'next/server'
import { verifySteamOpenId, extractSteamIdFromClaimedId } from '@/lib/steam/openid'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const params = url.searchParams
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || url.origin

  const returnedState = params.get('state')
  const cookieState = request.cookies.get('steam_oauth_state')?.value

  if (!returnedState || !cookieState || returnedState !== cookieState) {
    return NextResponse.redirect(`${appUrl}/settings?steam_error=invalid_state`)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id || !user.email) {
    return NextResponse.redirect(`${appUrl}/login`)
  }

  const isValid = await verifySteamOpenId(params)

  if (!isValid) {
    return NextResponse.redirect(`${appUrl}/settings?steam_error=verification_failed`)
  }

  const claimedId = params.get('openid.claimed_id')

  if (!claimedId) {
    return NextResponse.redirect(`${appUrl}/settings?steam_error=missing_claimed_id`)
  }

  const steamId = extractSteamIdFromClaimedId(claimedId)

  if (!steamId) {
    return NextResponse.redirect(`${appUrl}/settings?steam_error=invalid_steam_id`)
  }

  const currentUser = await prisma.user.findFirst({
    where: {
      OR: [{ authUserId: user.id }, { email: user.email }],
    },
  })

  if (!currentUser) {
    return NextResponse.redirect(`${appUrl}/settings?steam_error=user_not_found`)
  }

  const existingBySteamId = await prisma.linkedAccount.findFirst({
    where: {
      provider: 'STEAM',
      providerUserId: steamId,
    },
  })

  if (existingBySteamId && existingBySteamId.userId !== currentUser.id) {
    return NextResponse.redirect(`${appUrl}/settings?steam_error=already_linked`)
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

  const response = NextResponse.redirect(`${appUrl}/settings?steam_linked=1`)
  response.cookies.set('steam_oauth_state', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  return response
}