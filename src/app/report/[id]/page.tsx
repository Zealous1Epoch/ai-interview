'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getReport, getInterview } from '@/lib/db'
import ReportCard from '@/components/ReportCard'
import PracticePanel from '@/components/PracticePanel'
import type { Report, Interview, PracticeType } from '@/lib/types'

export default function ReportPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [report, setReport] = useState<Report | null>(null)
  const [interview, setInterview] = useState<Interview | null>(null)
  const [practiceType, setPracticeType] = useState<PracticeType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function loadData() {
    const [r, iv] = await Promise.all([getReport(id), getInterview(id)])
    setReport(r || null)
    setInterview(iv || null)
    setLoading(false)
  }

  if (practiceType) {
    return <PracticePanel practiceType={practiceType} onBack={() => setPracticeType(null)} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-400 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-zinc-400">加载中...</p>
        </div>
      </div>
    )
  }

  if (!report || !interview) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-zinc-400">报告未找到</p>
        <button onClick={() => router.push('/')} className="btn-secondary">返回首页</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 max-w-lg lg:max-w-2xl mx-auto pb-16">
      <ReportCard
        report={report}
        position={interview.position}
        duration={interview.duration}
        onPractice={(t) => setPracticeType(t as PracticeType)}
      />

      <div className="flex gap-4 mt-10">
        <button onClick={() => router.push('/setup')} className="btn-primary flex-1">
          再来一次
        </button>
        <button onClick={() => router.push('/')} className="btn-secondary flex-1">
          返回首页
        </button>
      </div>
    </div>
  )
}
