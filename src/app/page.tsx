import Link from 'next/link'
import { getAuthUser } from '@/lib/auth/get-user'

export default async function HomePage() {
  const user = await getAuthUser()

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-neutral-400">
          GameNight
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Decide what to play next.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-neutral-400 sm:text-lg">
          A cross-platform game library and recommendation hub with Steam sync,
          manual imports, and explainable suggestions.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href={user ? '/dashboard' : '/signup'}
            className="rounded-xl bg-gray-700 px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
          >
            {user ? 'Go to dashboard' : 'Get started'}
          </Link>
          {!user ? (
            <Link
              href="/login"
              className="rounded-xl border border-neutral-800 px-5 py-3 text-sm font-medium text-white transition hover:border-neutral-600"
            >
              Log in
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  )
}