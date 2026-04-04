'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/get-user'

export async function unlinkSteamAccountAction() {
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

  if (!linkedAccount) {
    return { error: 'No linked Steam account found.' }
  }

  await prisma.linkedAccount.delete({
    where: { id: linkedAccount.id },
  })

  await prisma.syncLog.create({
    data: {
      userId: currentUser.id,
      provider: 'STEAM',
      status: 'SUCCESS',
      message: 'Steam account unlinked',
    },
  })

  revalidatePath('/settings')
  revalidatePath('/dashboard')
  revalidatePath('/library')
  revalidatePath('/recommendations')

  return { success: 'Steam account unlinked.' }
}