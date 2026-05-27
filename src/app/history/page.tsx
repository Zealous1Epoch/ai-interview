'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAllInterviews, deleteInterview, getReport } from '@/lib/db'
import HistoryCard from '@/components/HistoryCard'
import type { Interview } from '@/lib/types'

export default function HistoryPage() {
  const router = useRouter()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [scores, setScores] = useState<Record<string, number>>({})

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const list = await getAllInterviews()
    list.sort((a, b) => b.createdAt - a.createdAt)
    setInterviews(list)
    const scoreMap: Record<string, number> = {}
    for (const iv of list) {
      const report = await getReport(iv.id)
      if (report) scoreMap[iv.id] = Object.values(report.scores).reduce((a, b) => a + b, 0) / 4
    }
    setScores(scoreMap)
  }

  async function handleDelete(id: string) {
    await deleteInterview(id)
    setInterviews((prev) => prev.filter((iv) => iv.id !== id))
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 max-w-lg lg:max-w-3xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-zinc-900 tracking-tight">历史记录</h1>
          <p className="text-base leading-7 text-zinc-400 mt-1">
            {interviews.length > 0 ? `共 ${interviews.length} 次面试` : '还没有面试记录'}
          </p>
        </div>
        <button onClick={() => router.push('/')} className="btn-ghost px-4 py-2 text-sm">
          返回首页
        </button>
      </div>

      {interviews.length === 0 ? (
        <div className="text-center py-24 animate-fade-in-scale">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-zinc-100 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" className="text-zinc-300">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <p className="text-zinc-400 mb-5">还没有面试记录</p>
          <button onClick={() => router.push('/setup')} className="btn-primary text-sm">
            开始第一次面试
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((iv, i) => (
            <div key={iv.id} className={`animate-fade-in stagger-${Math.min(i, 4) + 1}`}>
              <HistoryCard
                interview={iv}
                score={scores[iv.id]}
                onClick={() => router.push(`/report/${iv.id}`)}
                onDelete={() => handleDelete(iv.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
