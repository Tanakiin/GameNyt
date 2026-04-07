import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireCurrentUser } from '@/lib/auth/require-current-user'
import { extractPlayModes } from '@/lib/games/metadata'

export default async function FriendComparePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const currentUser = await requireCurrentUser()
  const { id } = await params

  const friendship = await prisma.friendRequest.findFirst({
    where: {
      status: 'ACCEPTED',
      OR: [
        {
          requesterId: currentUser.id,
          recipientId: id,
        },
        {
          requesterId: id,
          recipientId: currentUser.id,
        },
      ],
    },
  })

  if (!friendship) {
    notFound()
  }

  const friend = await prisma.user.findUnique({
    where: { id },
  })

  if (!friend) {
    notFound()
  }

  const myGames = await prisma.userGame.findMany({
    where: { userId: currentUser.id },
    include: { game: true },
  })

  const friendGames = await prisma.userGame.findMany({
    where: { userId: friend.id },
    include: { game: true },
  })

  const myMap = new Map(myGames.map((entry) => [entry.gameId, entry]))
  const friendMap = new Map(friendGames.map((entry) => [entry.gameId, entry]))

  const shared = myGames.filter((entry) => friendMap.has(entry.gameId))
  const onlyMine = myGames.filter((entry) => !friendMap.has(entry.gameId))
  const onlyTheirs = friendGames.filter((entry) => !myMap.has(entry.gameId))

  const sharedMultiplayer = shared.filter((entry) => {
    const tags = (entry.game as typeof entry.game & { tags?: unknown }).tags
    return extractPlayModes(tags).length > 0
  })

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-neutral-500">Friends</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          You vs {friend.username || friend.email}
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Compare overlap, gaps, and games worth playing together.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat title="Shared games" value={shared.length} />
        <Stat title="Only yours" value={onlyMine.length} />
        <Stat title="Only theirs" value={onlyTheirs.length} />
        <Stat title="Shared multiplayer" value={sharedMultiplayer.length} />
      </div>

      <Section
        title="Shared multiplayer games"
        items={sharedMultiplayer.map((entry) => entry.game.title)}
        empty="No shared multiplayer-friendly games found yet."
      />

      <Section
        title="Shared library"
        items={shared.map((entry) => entry.game.title)}
        empty="No shared games yet."
      />

      <Section
        title="Only in your library"
        items={onlyMine.map((entry) => entry.game.title)}
        empty="Nothing unique on your side."
      />

      <Section
        title="Only in their library"
        items={onlyTheirs.map((entry) => entry.game.title)}
        empty="Nothing unique on their side."
      />
    </div>
  )
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5">
      <p className="text-sm text-neutral-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    </div>
  )
}

function Section({
  title,
  items,
  empty,
}: {
  title: string
  items: string[]
  empty: string
}) {
  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-neutral-500">{empty}</p>
      ) : (
        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div
              key={item}
              className="rounded-xl border border-neutral-800 bg-black/20 px-3 py-2 text-sm text-neutral-200"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}