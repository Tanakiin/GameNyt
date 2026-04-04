'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/get-user'

export type SettingsState = {
  error?: string
  success?: string
}

const VALID_GENRES = [
  'Action',
  'Adventure',
  'RPG',
  'Strategy',
  'Shooter',
  'Puzzle',
  'Simulation',
  'Indie',
  'Platformer',
  'Racing',
  'Sports',
  'Horror',
]

const VALID_SESSION_LENGTHS = ['short', 'medium', 'long'] as const

export async function saveSettingsAction(
  _prevState: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { error: 'You must be logged in.' }
  }

  const username = String(formData.get('username') ?? '').trim() || null
  const steamProfile = String(formData.get('steamProfile') ?? '').trim()
  const sessionLength = String(formData.get('sessionLength') ?? '').trim()
  const preferredGenres = formData.getAll('preferredGenres').map(String)

  const cleanedGenres = preferredGenres.filter((genre) => VALID_GENRES.includes(genre))
  const cleanedSessionLength = VALID_SESSION_LENGTHS.includes(
    sessionLength as (typeof VALID_SESSION_LENGTHS)[number]
  )
    ? sessionLength
    : null

  const takenUsername =
    username &&
    (await prisma.user.findFirst({
      where: {
        username,
        NOT: { id: currentUser.id },
      },
    }))

  if (takenUsername) {
    return { error: 'That username is already taken.' }
  }

  await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      username,
      preferredGenres: cleanedGenres,
      sessionLength:
        cleanedSessionLength === 'short'
          ? 30
          : cleanedSessionLength === 'medium'
            ? 90
            : cleanedSessionLength === 'long'
              ? 180
              : null,
    },
  })

  const existingSteam = await prisma.linkedAccount.findFirst({
    where: {
      userId: currentUser.id,
      provider: 'STEAM',
    },
  })

  if (steamProfile) {
    if (existingSteam) {
      await prisma.linkedAccount.update({
        where: { id: existingSteam.id },
        data: {
          profileUrl: steamProfile,
        },
      })
    } else {
      await prisma.linkedAccount.create({
        data: {
          userId: currentUser.id,
          provider: 'STEAM',
          providerUserId: 'pending',
          profileUrl: steamProfile,
        },
      })
    }
  }

  revalidatePath('/settings')
  revalidatePath('/dashboard')
  return { success: 'Settings saved.' }
}