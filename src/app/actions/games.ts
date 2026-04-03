'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/get-user'
import { upsertGameFromRawg } from '@/lib/db/games'
import { GameSource, GameStatus } from '@prisma/client'

export type AddGameState = {
  error?: string
  success?: string
}

export async function addManualGameAction(
  _prevState: AddGameState,
  formData: FormData
): Promise<AddGameState> {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { error: 'You must be logged in to add a game.' }
  }

  const rawgIdValue = formData.get('rawgId')
  const sourceValue = formData.get('source')

  const rawgId = Number(rawgIdValue)
  const source = typeof sourceValue === 'string' ? sourceValue.toUpperCase() : 'MANUAL'

  if (!Number.isFinite(rawgId)) {
    return { error: 'Invalid game selection.' }
  }

  if (!Object.values(GameSource).includes(source as GameSource)) {
    return { error: 'Invalid game source.' }
  }

  const game = await upsertGameFromRawg(rawgId)

  const existingUserGame = await prisma.userGame.findFirst({
    where: {
      userId: currentUser.id,
      gameId: game.id,
      source: source as GameSource,
    },
  })

  if (existingUserGame) {
    return { success: 'That game is already in your library.' }
  }

  await prisma.userGame.create({
    data: {
      userId: currentUser.id,
      gameId: game.id,
      source: source as GameSource,
      status: GameStatus.UNPLAYED,
      importedFromSteam: false,
      playtimeMinutes: 0,
    },
  })

  revalidatePath('/library')
  revalidatePath('/library/add')
  revalidatePath('/dashboard')
  revalidatePath('/recommendations')

  return { success: 'Game added to your library.' }
}