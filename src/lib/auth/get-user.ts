import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function getAuthUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export async function getCurrentUser() {
  const authUser = await getAuthUser()

  if (!authUser?.id) {
    return null
  }

  const dbUser = await prisma.user.findFirst({
    where: {
      OR: [
        { authUserId: authUser.id },
        ...(authUser.email ? [{ email: authUser.email }] : []),
      ],
    },
  })

  if (dbUser) {
    if (!dbUser.authUserId || dbUser.authUserId !== authUser.id) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          authUserId: authUser.id,
        },
      })

      return {
        ...dbUser,
        authUserId: authUser.id,
      }
    }

    return dbUser
  }

  if (!authUser.email) {
    return null
  }

  return prisma.user.create({
    data: {
      authUserId: authUser.id,
      email: authUser.email,
      username: authUser.user_metadata?.username ?? null,
    },
  })
}