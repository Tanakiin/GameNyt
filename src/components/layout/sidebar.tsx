import Link from 'next/link'
import { LayoutDashboard, Library, Sparkles, Settings } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/library', label: 'Library', icon: Library },
  { href: '/recommendations', label: 'Recommendations', icon: Sparkles },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-neutral-800 bg-neutral-950 lg:block">
      <div className="flex h-full flex-col p-6">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">GameNight</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Your game hub</h2>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}