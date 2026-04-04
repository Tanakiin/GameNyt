import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/get-user'

export async function requireCurrentUser() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  return currentUser
}