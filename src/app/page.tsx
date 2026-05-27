'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-zinc-50">
      <div className="text-center max-w-md">
        {/* Logo mark */}
        <div className="mb-10 animate-fade-in-scale">
          <div className="w-16 h-16 mx-auto rounded-2xl border border-zinc-200 bg-white flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" className="text-zinc-800">
              <path d="M12 2a3 3 0 0 0-3 3v2h6V5a3 3 0 0 0-3-3z" />
              <path d="M4 11a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-5z" />
              <circle cx="9" cy="14" r="1" fill="currentColor" />
              <circle cx="15" cy="14" r="1" fill="currentColor" />
            </svg>
          </div>
        </div>

        <h1 className="font-serif text-3xl font-semibold text-zinc-900 mb-4 tracking-tight animate-fade-in stagger-1">
          AI 面试模拟
        </h1>

        <p className="text-base leading-7 text-zinc-500 mb-10 animate-fade-in stagger-2">
          全真模拟 · 智能评估 · 专项提升
        </p>

        <div className="flex flex-col gap-4 animate-fade-in stagger-3">
          <Link
            href="/setup"
            className="btn-primary w-full text-center text-base py-3.5">
            开始面试
          </Link>
          <Link
            href="/history"
            className="btn-secondary w-full text-center py-3.5">
            查看历史记录
          </Link>
        </div>

        <p className="mt-12 text-xs text-zinc-400 animate-fade-in stagger-4">
          无需注册 · 数据本地存储 · 完全免费
        </p>
      </div>
    </div>
  )
}
