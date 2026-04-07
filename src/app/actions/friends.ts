'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/get-user'

export type FriendActionState = {
  error?: string
  success?: string
}

export async function sendFriendRequestAction(
  _prevState: FriendActionState,
  formData: FormData
): Promise<FriendActionState> {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return { error: 'You must be logged in.' }
  }

  const query = formData.get('query')?.toString().trim()

  if (!query) {
    return { error: 'Enter a username or email.' }
  }

  const targetUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: query, mode: 'insensitive' } },
        { username: { equals: query, mode: 'insensitive' } },
      ],
    },
  })

  if (!targetUser) {
    return { error: 'User not found.' }
  }

  if (targetUser.id === currentUser.id) {
    return { error: 'You cannot add yourself.' }
  }

  const existing = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        {
          requesterId: currentUser.id,
          recipientId: targetUser.id,
        },
        {
          requesterId: targetUser.id,
          recipientId: currentUser.id,
        },
      ],
    },
  })

  if (existing) {
    if (existing.status === 'PENDING') {
      return { error: 'A friend request already exists.' }
    }

    if (existing.status === 'ACCEPTED') {
      return { error: 'You are already friends.' }
    }
  }

  await prisma.friendRequest.create({
    data: {
      requesterId: currentUser.id,
      recipientId: targetUser.id,
      status: 'PENDING',
    },
  })

  revalidatePath('/friends')
  return { success: 'Friend request sent.' }
}

export async function acceptFriendRequestAction(formData: FormData): Promise<void> {
  const requestId = formData.get('requestId')?.toString()

  const currentUser = await getCurrentUser()

  if (!currentUser || !requestId) return

  const request = await prisma.friendRequest.findUnique({
    where: { id: requestId },
  })

  if (!request || request.recipientId !== currentUser.id) return

  await prisma.friendRequest.update({
    where: { id: requestId },
    data: { status: 'ACCEPTED' },
  })

  revalidatePath('/friends')
}

export async function declineFriendRequestAction(formData: FormData): Promise<void> {
  const requestId = formData.get('requestId')?.toString()

  const currentUser = await getCurrentUser()

  if (!currentUser || !requestId) return

  const request = await prisma.friendRequest.findUnique({
    where: { id: requestId },
  })

  if (!request || request.recipientId !== currentUser.id) return

  await prisma.friendRequest.update({
    where: { id: requestId },
    data: { status: 'DECLINED' },
  })

  revalidatePath('/friends')
}

export async function removeFriendAction(formData: FormData): Promise<void> {
  const friendUserId = formData.get('friendUserId')?.toString()

  const currentUser = await getCurrentUser()

  if (!currentUser || !friendUserId) return

  await prisma.friendRequest.deleteMany({
    where: {
      status: 'ACCEPTED',
      OR: [
        {
          requesterId: currentUser.id,
          recipientId: friendUserId,
        },
        {
          requesterId: friendUserId,
          recipientId: currentUser.id,
        },
      ],
    },
  })

  revalidatePath('/friends')
  revalidatePath(`/friends/${friendUserId}`)
}