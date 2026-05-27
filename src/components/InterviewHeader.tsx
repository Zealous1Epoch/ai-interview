'use client'

import { useState } from 'react'
import { DIRECTION_LABELS } from '@/lib/types'
import type { Direction, Stage } from '@/lib/types'
import StageIndicator from './StageIndicator'
import { formatDuration } from '@/lib/utils'

interface Props {
  position: string
  direction: Direction
  stage: Stage
  onExit: () => void
  duration: number
}

export default function InterviewHeader({ position, direction, stage, onExit, duration }: Props) {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <>
      <div className="bg-white border-b border-zinc-200">
        <div className="flex items-center justify-between px-4 py-3 max-w-3xl mx-auto">
          <button
            onClick={() => setShowConfirm(true)}
            className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors font-medium"
          >
            ← 退出
          </button>

          <div className="text-center">
            <div className="text-sm font-semibold text-zinc-800">{position}</div>
            <div className="flex items-center gap-2 justify-center mt-0.5">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-zinc-100 text-zinc-500">
                {DIRECTION_LABELS[direction]}
              </span>
              <span className="text-xs text-zinc-400 font-mono">{formatDuration(duration)}</span>
            </div>
          </div>

          <div className="w-10" />
        </div>
      </div>

      <StageIndicator currentStage={stage} />

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 max-w-sm w-full animate-fade-in-scale">
            <h3 className="text-lg font-semibold text-zinc-800 mb-2">确定退出面试？</h3>
            <p className="text-sm text-zinc-500 mb-5 leading-7">
              退出后当前对话将保存，可在历史记录中查看。
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirm(false)} className="btn-ghost px-5 py-2 text-sm">
                继续面试
              </button>
              <button onClick={onExit} className="btn-primary px-5 py-2 text-sm">
                确定退出
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
