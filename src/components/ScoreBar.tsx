interface Props {
  label: string
  score: number
}

export default function ScoreBar({ label, score }: Props) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-zinc-600 w-20">{label}</span>
      <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-zinc-800 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${(score / 10) * 100}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-zinc-800 w-6 text-right tabular-nums">{score}</span>
      <span className="text-xs text-zinc-400">/10</span>
    </div>
  )
}
