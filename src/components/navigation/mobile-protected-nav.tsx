'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/library', label: 'Library' },
  { href: '/recommendations', label: 'Recommendations' },
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
      <div className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/dashboard" className="text-base font-semibold text-white">
            GameNight
          </Link>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800"
          >
            <div className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-4 bg-white" />
              <span className="block h-0.5 w-4 bg-white" />
              <span className="block h-0.5 w-4 bg-white" />
            </div>
          </button>
        </div>

        {open ? (
          <div className="border-t border-neutral-800 bg-neutral-950 px-3 py-3">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      active
                        ? 'rounded-xl border border-cyan-400/30 bg-cyan-400/12 px-3 py-3 text-sm font-medium text-cyan-200'
                        : 'rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-3 text-sm font-medium text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800'
                    }
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        ) : null}
      </div>
    </div>
  )
}