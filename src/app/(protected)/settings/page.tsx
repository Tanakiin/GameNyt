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

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-neutral-500">Settings</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Account settings</h1>
      </div>

      <SteamLinkCard
        linked={Boolean(linkedAccount)}
        steamId={linkedAccount?.providerUserId ?? null}
        lastSyncedAt={linkedAccount?.lastSyncedAt ?? null}
      />

      {linkedAccount ? <SyncSteamButton /> : null}
    </div>
  )
}