import { useState } from 'react'
import type { Interview } from '@/lib/types'
import { DIRECTION_LABELS } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface Props {
  interview: Interview
  score?: number
  onClick: () => void
  onDelete: () => void
}

export default function HistoryCard({ interview, score, onClick, onDelete }: Props) {
  const stars = score ? Math.round(score / 2) : 0
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <>
      <div
        onClick={onClick}
        className="card p-5 cursor-pointer transition-all duration-200 hover:border-zinc-300"
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <h3 className="font-serif font-semibold text-base text-zinc-800 truncate">
              {interview.position}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-zinc-100 text-zinc-500">
                {DIRECTION_LABELS[interview.direction]}
              </span>
              <span className="text-xs text-zinc-400">{formatDate(interview.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {score !== undefined && (
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 24 24"
                    fill={i <= stars ? '#18181b' : 'none'}
                    stroke={i <= stars ? '#18181b' : '#d4d4d8'} strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); setShowConfirm(true) }}
              className="text-xs text-zinc-300 hover:text-zinc-500 transition-colors"
            >
              删除
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 max-w-sm w-full animate-fade-in-scale">
            <h3 className="text-lg font-semibold text-zinc-800 mb-2">确认删除？</h3>
            <p className="text-sm text-zinc-500 mb-5 leading-7">
              将删除「{interview.position}」的面试记录和评估报告，此操作不可撤销。
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirm(false)} className="btn-ghost px-5 py-2 text-sm">
                取消
              </button>
              <button onClick={() => { setShowConfirm(false); onDelete() }} className="btn-primary px-5 py-2 text-sm bg-red-600 hover:bg-red-700">
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
