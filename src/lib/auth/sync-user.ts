import { prisma } from '@/lib/prisma'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export async function syncUserFromAuth(user: SupabaseUser) {
  const email = user.email

  if (!email) {
    throw new Error('Authenticated user is missing an email address')
  }

  const usernameFromMetadata =
    typeof user.user_metadata?.username === 'string' ? user.user_metadata.username : null

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { authUserId: user.id }],
    },
  })

  if (existingUser) {
    return prisma.user.update({
      where: { id: existingUser.id },
      data: {
        email,
        authUserId: user.id,
        username: existingUser.username ?? usernameFromMetadata,
      },
    })
  }

  let username = usernameFromMetadata

  if (username) {
    const taken = await prisma.user.findUnique({
      where: { username },
    })

    if (taken) {
      username = `${username}_${Math.floor(Math.random() * 10000)}`
    }
  }

  return prisma.user.create({
    data: {
      authUserId: user.id,
      email,
      username,
    },
  })
}