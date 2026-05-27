'use client'

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-400 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-zinc-400">加载历史记录...</p>
      </div>
    </div>
  )
}
