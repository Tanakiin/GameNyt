import { Sidebar } from '@/components/layout/sidebar'
import { UserMenu } from '@/components/layout/user-menu'

type AppShellProps = {
  children: React.ReactNode
  email: string
  username?: string | null
}

export function AppShell({ children, email, username }: AppShellProps) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-neutral-800 bg-neutral-950/80 px-6 py-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Welcome back</p>
                <h1 className="text-lg font-semibold text-white">GameNight</h1>
              </div>

              <UserMenu email={email} username={username} />
            </div>
          </header>

          <main className="flex-1 px-6 py-8">{children}</main>
        </div>
      </div>
    </div>
  )
}