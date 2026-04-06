import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/library', label: 'Library' },
  { href: '/recommendations', label: 'Recommendations' },
  { href: '/settings', label: 'Settings' },
]

export function ProtectedSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 shrink-0 border-r border-neutral-800/80 bg-neutral-950/70 backdrop-blur md:block">
      <div className="sticky top-0 flex min-h-screen flex-col p-6">
        <p className="text-lg font-semibold text-white">GameNight</p>

        <nav className="mt-8 flex flex-col gap-2">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20'
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}