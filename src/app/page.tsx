import Link from 'next/link'
import { getAuthUser } from '@/lib/auth/get-user'
import { HeroOrb } from '@/components/home/hero-orb'
import { StatStrip } from '@/components/home/stat-strip'
import { FeatureGrid } from '@/components/home/feature-grid'

export default async function HomePage() {
  const user = await getAuthUser()

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <HeroOrb />

      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-500">
            GameNight
          </p>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
            Stop scrolling.
            <br />
            Pick something worth playing.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-400 sm:text-lg">
            A personal game hub for Steam and beyond, with a cleaner library, better context,
            and recommendations that are explainable instead of random.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={user ? '/dashboard' : '/signup'}
              className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
            >
              {user ? 'Go to dashboard' : 'Get started'}
            </Link>

            <Link
              href={user ? '/library' : '/login'}
              className="rounded-xl border border-neutral-800 px-5 py-3 text-sm font-medium text-white transition hover:border-neutral-600"
            >
              {user ? 'View library' : 'Log in'}
            </Link>
          </div>
        </div>

        <div className="mt-16">
          <StatStrip />
        </div>

        <div className="mt-16">
          <FeatureGrid />
        </div>
      </section>
    </main>
  )
}