import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { requireCurrentUser } from '@/lib/auth/require-current-user'
import { MobileProtectedNav } from '@/components/navigation/mobile-protected-nav'
import { ProtectedSidebar } from '@/components/navigation/protected-sidebar'

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode
}) {
  await requireCurrentUser()

  const headersList = await headers()
  const pathname = headersList.get('x-current-path') ?? ''

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <MobileProtectedNav />

      <div className="mx-auto flex min-h-screen max-w-screen-2xl">
        <ProtectedSidebar pathname={pathname} />

        <main className="min-w-0 flex-1 px-4 py-5 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}