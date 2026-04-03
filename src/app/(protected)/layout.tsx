import { redirect } from 'next/navigation'
import { getAuthUser, getCurrentUser } from '@/lib/auth/get-user'
import { AppShell } from '@/components/layout/app-shell'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authUser = await getAuthUser()

  if (!authUser?.id) {
    redirect('/login')
  }

  const currentUser = await getCurrentUser()

  return (
    <AppShell
      email={authUser.email ?? 'No email'}
      username={currentUser?.username}
    >
      {children}
    </AppShell>
  )
}