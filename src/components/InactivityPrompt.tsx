'use client'

interface Props {
  onDismiss: () => void
}

export default function InactivityPrompt({ onDismiss }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 max-w-sm w-full text-center animate-fade-in-scale">
        <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-zinc-100 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" className="text-zinc-400">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
        <p className="font-semibold text-zinc-800 mb-1">还在吗？</p>
        <p className="text-sm text-zinc-500 mb-4">面试官在等你回答...</p>
        <button onClick={onDismiss} className="btn-primary w-full py-2.5 text-sm">
          继续面试
        </button>
      </div>
    </div>
  )
}
