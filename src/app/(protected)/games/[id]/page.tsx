import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/get-user'
import {
  formatDateShort,
  formatPlaytime,
  getGameImageUrls,
  getPlayTier,
  getPlayTierLabel,
  getStatusLabel,
  normalizeNameList,
} from '@/lib/games/metadata'
import { HoverScrubGallery } from '@/components/games/hover-scrub-gallery'
import { GameDetailForm } from './game-detail-form'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params

  const game = await prisma.game.findUnique({
    where: { id },
    select: { title: true }
  })

  if (!game) {
    return {
      title: 'Game Not Found'
    }
  }

  return {
    title: `${game.title} | GameNight`
  }
}

export default async function GameDetailPage({ params }: PageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const { id } = await params

  const userGame = await prisma.userGame.findFirst({
    where: {
      userId: user.id,
      gameId: id
    },
    include: {
      game: true
    }
  })

  if (!userGame) {
    notFound()
  }

  const genres = normalizeNameList(userGame.game.genres)
  const platforms = normalizeNameList(userGame.game.platforms)
  const images = getGameImageUrls(userGame.game)
  const playTier = getPlayTier(userGame.playtimeMinutes)

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,1fr)]">
        <div className="space-y-6">
          <HoverScrubGallery
            images={images}
            title={userGame.game.title}
            aspectClassName="aspect-[16/9]"
            roundedClassName="rounded-2xl"
          />

          {userGame.game.description ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold text-white">About</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-white/70">
                {userGame.game.description}
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white">
                  {userGame.game.title}
                </h1>
                <p className="mt-1 text-sm text-white/60">
                  Added to your library via {userGame.source.toLowerCase()}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
                  {getStatusLabel(userGame.status)}
                </span>
                <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-sm text-violet-200">
                  {getPlayTierLabel(playTier)}
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <InfoCard label="Release date" value={formatDateShort(userGame.game.releaseDate)} />
              <InfoCard label="RAWG rating" value={userGame.game.rawgRating?.toString() ?? 'N/A'} />
              <InfoCard label="Your rating" value={userGame.personalRating?.toString() ?? 'N/A'} />
              <InfoCard label="Playtime" value={formatPlaytime(userGame.playtimeMinutes)} />
              <InfoCard
                  label="Last played"
                  value={
                    userGame.lastPlayedAt
                      ? formatDateShort(userGame.lastPlayedAt)
                      : userGame.playtimeMinutes > 0
                        ? 'Played before'
                        : 'Never'
                  }
                />
              <InfoCard label="Source" value={userGame.source} />
            </div>

            {genres.length > 0 ? (
              <div className="mt-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/45">
                  Genres
                </p>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/75"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {platforms.length > 0 ? (
              <div className="mt-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/45">
                  Platforms
                </p>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((platform) => (
                    <span
                      key={platform}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/75"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">Edit your game data</h2>
            <p className="mt-1 text-sm text-white/55">
              Status is manual. Play tier is computed automatically from playtime.
            </p>

            <div className="mt-5">
              <GameDetailForm
                gameId={userGame.gameId}
                status={userGame.status}
                personalRating={userGame.personalRating}
                notes={userGame.notes}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <p className="text-xs uppercase tracking-[0.16em] text-white/40">{label}</p>
      <p className="mt-2 text-sm font-medium text-white/85">{value}</p>
    </div>
  )
}