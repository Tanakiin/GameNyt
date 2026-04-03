import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GameNight',
  description: 'Your personal game hub and recommendation engine',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  )
}