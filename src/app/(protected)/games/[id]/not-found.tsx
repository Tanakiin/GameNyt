import Link from 'next/link'

export default function GameDetailNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold text-white">Game not found</h1>
      <p className="mt-2 text-sm text-white/60">
        This game either does not exist or is not in your library.
      </p>
      <Link
        href="/library"
        className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 transition hover:bg-white/10"
      >
        Back to library
      </Link>
    </div>
  )
}