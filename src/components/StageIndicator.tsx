'use client'

import { STAGE_LABELS } from '@/lib/types'
import type { Stage } from '@/lib/types'

interface Props {
  currentStage: Stage
}

const STAGES: Stage[] = ['self-intro', 'project-deep', 'tech-qa', 'behavioral', 'reverse-qa']

export default function StageIndicator({ currentStage }: Props) {
  const currentIdx = STAGES.indexOf(currentStage)

  return (
    <div className="px-4 py-3 overflow-x-auto">
      <div className="flex items-center gap-1.5 min-w-max justify-center">
        {STAGES.map((stage, i) => {
          const isDone = i < currentIdx
          const isCurrent = i === currentIdx

          return (
            <div key={stage} className="flex items-center gap-1.5">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  isDone
                    ? 'bg-zinc-100 text-zinc-400'
                    : isCurrent
                      ? 'bg-zinc-900 text-white'
                      : 'bg-white border border-zinc-200 text-zinc-400'
                }`}
              >
                {isDone && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                {STAGE_LABELS[stage]}
              </div>
              {i < STAGES.length - 1 && <div className="w-3 h-px bg-zinc-200" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
