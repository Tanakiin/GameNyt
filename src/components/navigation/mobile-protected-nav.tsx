'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/library', label: 'Library' },
  { href: '/recommendations', label: 'Recommendations' },
  { href: '/friends', label: 'Friends' },
  { href: '/settings', label: 'Settings' },
]

export function MobileProtectedNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="md:hidden">
      <div className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/dashboard" className="text-base font-semibold text-white">
            GameNight
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-white"
          >
            ☰
          </button>
        </div>

        {open && (
          <div className="border-t border-neutral-800 bg-neutral-950 px-3 py-3">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-xl px-3 py-3 text-sm ${
                      active
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20'
                        : 'bg-neutral-900 text-neutral-300'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}