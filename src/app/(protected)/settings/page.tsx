import { prisma } from '@/lib/prisma'
import { requireCurrentUser } from '@/lib/auth/require-current-user'
import { SteamLinkCard } from './steam-link-card'
import { SyncSteamButton } from './sync-steam-button'

export default async function SettingsPage() {
  const currentUser = await requireCurrentUser()

  const linkedAccount = await prisma.linkedAccount.findFirst({
    where: {
      userId: currentUser.id,
      provider: 'STEAM',
    },
  })

  const latestSync = await prisma.syncLog.findFirst({
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
        <h1 className="text-3xl font-semibold tracking-tight text-white">Account settings</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-400">
          For full Steam stats, set Steam profile privacy so Game Details are public. If playtime appears
          but last played does not, Steam is usually not returning that field for the account.
        </p>
      </div>

      <SteamLinkCard
        linked={Boolean(linkedAccount)}
        steamId={linkedAccount?.providerUserId ?? null}
        lastSyncedAt={linkedAccount?.lastSyncedAt ?? null}
      />

      {linkedAccount ? (
        <div className="space-y-3">
          <SyncSteamButton />

          {latestSync ? (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Latest sync</p>
              <p className="mt-2 text-sm text-neutral-300">
                {latestSync.message ?? 'No sync details available.'}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                {new Date(latestSync.syncedAt).toLocaleString()}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}