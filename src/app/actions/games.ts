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

export type UpdateGameDetailState = {
  error?: string
  success?: boolean
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

export async function updateUserGameDetailsAction(
  _prevState: UpdateGameDetailState,
  formData: FormData
): Promise<UpdateGameDetailState> {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { error: 'You must be signed in.' }
  }

  const gameId = formData.get('gameId')?.toString()
  const statusValue = formData.get('status')?.toString()
  const personalRatingRaw = formData.get('personalRating')?.toString() ?? ''
  const notesRaw = formData.get('notes')?.toString() ?? ''

  if (!gameId) {
    return { error: 'Missing game id.' }
  }

  const allowedStatuses = Object.values(GameStatus)
  const status = allowedStatuses.includes(statusValue as GameStatus)
    ? (statusValue as GameStatus)
    : undefined

  const parsedRating =
    personalRatingRaw.trim() === '' ? null : Number(personalRatingRaw)

  if (
    parsedRating !== null &&
    (!Number.isFinite(parsedRating) || parsedRating < 0 || parsedRating > 10)
  ) {
    return { error: 'Rating must be between 0 and 10.' }
  }

  const personalRating = parsedRating === null ? null : Math.round(parsedRating)

  const existingUserGame = await prisma.userGame.findFirst({
    where: {
      userId: currentUser.id,
      gameId,
    },
  })

  if (!existingUserGame) {
    return { error: 'Game not found in your library.' }
  }

  await prisma.userGame.update({
    where: {
      id: existingUserGame.id,
    },
    data: {
      ...(status ? { status } : {}),
      personalRating,
      notes: notesRaw.trim() || null,
    },
  })

  revalidatePath(`/games/${gameId}`)
  revalidatePath('/library')
  revalidatePath('/dashboard')
  revalidatePath('/recommendations')

  return { success: true }
}