import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/get-user'
import { SettingsForm } from './settings-form'
import { SyncSteamButton } from './sync-steam-button'

export default async function SettingsPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) return null

  const steamAccount = await prisma.linkedAccount.findFirst({
    where: {
      userId: currentUser.id,
      provider: 'STEAM',
    },
  })

  const preferredGenres = Array.isArray(currentUser.preferredGenres)
    ? (currentUser.preferredGenres as string[])
    : []

  const recentSync = await prisma.syncLog.findFirst({
    where: {
      userId: currentUser.id,
      provider: 'STEAM',
    },
    orderBy: {
      syncedAt: 'desc',
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-neutral-500">Settings</p>
        <h2 className="text-3xl font-semibold tracking-tight">Account and preferences</h2>
        <p className="mt-2 max-w-2xl text-neutral-400">
          Manage your profile, Steam connection, preferred genres, and your typical session length.
        </p>
      </div>

      <SettingsForm
        username={currentUser.username}
        steamProfile={steamAccount?.profileUrl}
        preferredGenres={preferredGenres}
        sessionLengthMinutes={currentUser.sessionLength}
      />

      <SyncSteamButton />

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <h3 className="text-lg font-semibold text-white">Last sync</h3>
        <p className="mt-2 text-sm text-neutral-400">
          {recentSync
            ? `${recentSync.status.toLowerCase()} — ${recentSync.message ?? 'No details'}`
            : 'No Steam sync has been run yet.'}
        </p>
      </div>
    </div>
  )
}