'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/get-user'
import { getOwnedSteamGames } from '@/lib/steam/client'
import { upsertGameFromRawg } from '@/lib/db/games'
import { GameStatus } from '@prisma/client'

export type SteamSyncState = {
  error?: string
  success?: string
}

async function findOrCreateSteamGame({
  appid,
  name,
}: {
  appid: number
  name?: string
}) {
  const existing = await prisma.game.findUnique({
    where: { steamAppId: appid },
  })

  if (existing) {
    return existing
  }

  let createdFromRawg = null

  if (name?.trim()) {
    const rawgSearchUrl = new URL('https://api.rawg.io/api/games')
    rawgSearchUrl.searchParams.set('key', process.env.RAWG_API_KEY!)
    rawgSearchUrl.searchParams.set('search', name)
    rawgSearchUrl.searchParams.set('page_size', '1')

    const rawgResponse = await fetch(rawgSearchUrl.toString(), {
      method: 'GET',
      cache: 'no-store',
    })

    if (rawgResponse.ok) {
      const rawgData = await rawgResponse.json()
      const first = rawgData.results?.[0]

      if (first?.id) {
        createdFromRawg = await upsertGameFromRawg(first.id)

        return prisma.game.update({
          where: { id: createdFromRawg.id },
          data: {
            steamAppId: appid,
          },
        })
      }
    }
  }

  return prisma.game.create({
    data: {
      steamAppId: appid,
      title: name?.trim() || `Steam App ${appid}`,
    },
  })
}

export async function syncSteamLibraryAction(): Promise<SteamSyncState> {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { error: 'You must be logged in.' }
  }

  const linkedAccount = await prisma.linkedAccount.findFirst({
    where: {
      userId: currentUser.id,
      provider: 'STEAM',
    },
  })

  if (!linkedAccount?.providerUserId || linkedAccount.providerUserId === 'pending') {
    return { error: 'Link your Steam account first.' }
  }

  try {
    const ownedGames = await getOwnedSteamGames(linkedAccount.providerUserId)

    for (const steamGame of ownedGames) {
      const game = await findOrCreateSteamGame({
        appid: steamGame.appid,
        name: steamGame.name,
      })

      const lastPlayedAt =
        steamGame.rtime_last_played && steamGame.rtime_last_played > 0
          ? new Date(steamGame.rtime_last_played * 1000)
          : null

      const existingUserGame = await prisma.userGame.findFirst({
        where: {
          userId: currentUser.id,
          gameId: game.id,
          source: 'STEAM',
        },
      })

      if (existingUserGame) {
        await prisma.userGame.update({
          where: { id: existingUserGame.id },
          data: {
            playtimeMinutes: steamGame.playtime_forever ?? 0,
            lastPlayedAt,
            importedFromSteam: true,
          },
        })
      } else {
        await prisma.userGame.create({
          data: {
            userId: currentUser.id,
            gameId: game.id,
            source: 'STEAM',
            playtimeMinutes: steamGame.playtime_forever ?? 0,
            lastPlayedAt,
            importedFromSteam: true,
            status: GameStatus.UNPLAYED,
          },
        })
      }
    }

    await prisma.linkedAccount.update({
      where: { id: linkedAccount.id },
      data: {
        lastSyncedAt: new Date(),
      },
    })

    await prisma.syncLog.create({
      data: {
        userId: currentUser.id,
        provider: 'STEAM',
        status: 'SUCCESS',
        message: `Imported ${ownedGames.length} Steam games`,
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/library')
    revalidatePath('/settings')
    revalidatePath('/recommendations')

    return { success: `Steam sync complete. Imported ${ownedGames.length} games.` }
  } catch (error) {
    await prisma.syncLog.create({
      data: {
        userId: currentUser.id,
        provider: 'STEAM',
        status: 'FAILED',
        message: error instanceof Error ? error.message : 'Steam sync failed',
      },
    })

    return {
      error: error instanceof Error ? error.message : 'Steam sync failed',
    }
  }
}