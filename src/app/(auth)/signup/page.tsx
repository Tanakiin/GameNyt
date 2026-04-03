import { SignupForm } from './signup-form'

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/80 p-8 shadow-2xl">
        <div className="mb-8">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-neutral-500">GameNight</p>
          <h1 className="text-2xl font-semibold text-white">Create your account</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Start building your game library and get smarter recommendations.
          </p>
        </div>

        <SignupForm />
      </div>
    </main>
  )
}