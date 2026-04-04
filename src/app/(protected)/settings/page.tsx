import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/get-user'
import { SettingsForm } from './settings-form'
import { SyncSteamButton } from './sync-steam-button'
import { SteamLinkCard } from './steam-link-card'

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const currentUser = await getCurrentUser()
  if (!currentUser) return null

  const params = (await searchParams) ?? {}

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

  const steamLinked = params.steam_linked === '1'
  const steamError = typeof params.steam_error === 'string' ? params.steam_error : null

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-neutral-500">Settings</p>
        <h2 className="text-3xl font-semibold tracking-tight">Account and preferences</h2>
        <p className="mt-2 max-w-2xl text-neutral-400">
          Manage your profile, connect Steam, and tune how recommendations should behave.
        </p>
      </div>

      {steamLinked ? (
        <div className="rounded-2xl border border-emerald-900 bg-emerald-950/40 p-4 text-sm text-emerald-300">
          Steam account linked successfully.
        </div>
      ) : null}

      {steamError ? (
        <div className="rounded-2xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
          Steam linking failed: {steamError}
        </div>
      ) : null}

      <SteamLinkCard
        linked={Boolean(steamAccount?.providerUserId)}
        steamId={steamAccount?.providerUserId}
        lastSyncedAt={steamAccount?.lastSyncedAt}
      />

      <SyncSteamButton />

      <SettingsForm
        username={currentUser.username}
        preferredGenres={preferredGenres}
        sessionLengthMinutes={currentUser.sessionLength}
      />

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