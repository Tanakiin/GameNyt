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

  return prisma.user.findFirst({
    where: {
      OR: [{ authUserId: authUser.id }, { email: authUser.email }],
    },
  })
}