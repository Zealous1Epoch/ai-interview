import type { Report } from '@/lib/types'
import { SCORE_LABELS } from '@/lib/types'
import ScoreBar from './ScoreBar'
import { formatDuration } from '@/lib/utils'

interface Props {
  report: Report
  position: string
  duration: number
  onPractice: (practiceType: string) => void
}

export default function ReportCard({ report, position, duration, onPractice }: Props) {
  const avg = Object.values(report.scores).reduce((a, b) => a + b, 0) / 4
  const stars = Math.round(avg / 2)

  return (
    <div className="space-y-8">
      {/* Score hero */}
      <div className="text-center animate-fade-in-scale">
        <div className="flex justify-center gap-1.5 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg key={i} width="22" height="22" viewBox="0 0 24 24"
              fill={i <= stars ? '#18181b' : 'none'}
              stroke={i <= stars ? '#18181b' : '#d4d4d8'} strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
        <h2 className="font-serif text-3xl font-semibold text-zinc-900">{position}</h2>
        <p className="text-sm text-zinc-400 mt-1">{formatDuration(duration)}</p>
      </div>

      {/* Scores */}
      <div className="card p-6 space-y-5 animate-fade-in stagger-1">
        {(Object.keys(report.scores) as (keyof typeof report.scores)[]).map((key) => (
          <ScoreBar key={key} label={SCORE_LABELS[key]} score={report.scores[key]} />
        ))}
      </div>

      {/* Summary */}
      <div className="card p-6 animate-fade-in stagger-2">
        <h3 className="text-sm font-semibold text-zinc-800 mb-3">综合评价</h3>
        <p className="text-base leading-7 text-zinc-500">{report.summary}</p>
      </div>

      {/* Strengths */}
      <div className="card p-6 animate-fade-in stagger-3">
        <h3 className="text-sm font-semibold text-zinc-800 mb-3 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          优势
        </h3>
        <ul className="space-y-2">
          {report.strengths.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm text-zinc-600 leading-7">
              <span className="mt-2 w-1 h-1 rounded-full bg-zinc-300 shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Improvements */}
      <div className="card p-6 animate-fade-in stagger-4">
        <h3 className="text-sm font-semibold text-zinc-800 mb-3 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
          </svg>
          待改进
        </h3>
        <ul className="space-y-3">
          {report.improvements.map((imp, i) => (
            <li key={i} className="flex items-start justify-between gap-3">
              <div className="flex gap-2 text-sm text-zinc-600 leading-7">
                <span className="mt-2 w-1 h-1 rounded-full bg-zinc-300 shrink-0" />
                {imp.content}
              </div>
              <button
                onClick={() => onPractice(imp.practiceType)}
                className="btn-ghost text-xs px-3 py-1 shrink-0"
              >
                专项练习 →
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
