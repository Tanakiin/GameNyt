import { logoutAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

type UserMenuProps = {
  email: string
  username?: string | null
}

export function UserMenu({ email, username }: UserMenuProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-medium text-white">{username || 'Player'}</p>
        <p className="text-xs text-neutral-400">{email}</p>
      </div>

      <form action={logoutAction}>
        <Button type="submit" variant="outline">
          Log out
        </Button>
      </form>
    </div>
  )
}