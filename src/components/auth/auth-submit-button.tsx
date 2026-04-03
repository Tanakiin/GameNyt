'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

type AuthSubmitButtonProps = {
  children: React.ReactNode
}

export function AuthSubmitButton({ children }: AuthSubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Please wait...' : children}
    </Button>
  )
}