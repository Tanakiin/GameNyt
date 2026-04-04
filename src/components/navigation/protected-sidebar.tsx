import Link from 'next/link'

type ProtectedSidebarProps = {
  pathname?: string
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/library', label: 'Library' },
  { href: '/settings', label: 'Settings' },
]

export function ProtectedSidebar({ pathname = '' }: ProtectedSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-neutral-800 bg-neutral-950 md:block">
      <div className="sticky top-0 flex min-h-screen flex-col p-5">
        <Link href="/dashboard" className="text-xl font-semibold text-white">
          GameNight
        </Link>

        <nav className="mt-8 flex flex-col gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? 'bg-white text-black'
                    : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
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