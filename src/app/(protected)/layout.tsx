import type { ReactNode } from 'react'
import { requireCurrentUser } from '@/lib/auth/require-current-user'
import { MobileProtectedNav } from '@/components/navigation/mobile-protected-nav'
import { ProtectedSidebar } from '@/components/navigation/protected-sidebar'

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode
}) {
  await requireCurrentUser()

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-[#0a0f14] to-black text-white">
      <MobileProtectedNav />

      <div className="flex min-h-screen">
        <ProtectedSidebar />

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}