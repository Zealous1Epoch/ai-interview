'use client'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-zinc-100 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" className="text-zinc-400">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
        <p className="text-sm text-zinc-500 mb-4">出了点问题</p>
        <button onClick={reset} className="btn-primary text-sm">重试</button>
      </div>
    </div>
  )
}
