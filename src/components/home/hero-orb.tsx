export function HeroOrb() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute right-[20%] top-40 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute left-[18%] top-56 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl" />
    </div>
  )
}