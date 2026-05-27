import { useConfigStore } from '../store/configStore'

export default function BottomBar() {
  const resetAll = useConfigStore((s) => s.resetAll)

  return (
    <footer
      className="h-11 border-t border-[var(--gray-300)] bg-[var(--paper)] flex items-center justify-between px-6 flex-shrink-0"
      style={{ borderWidth: 'var(--border-width)' }}
    >
      <div className="flex gap-4">
        {['预设模板', '重置全部', '导出配置', '导入配置'].map((label) => (
          <button
            key={label}
            onClick={label === '重置全部' ? resetAll : undefined}
            className="font-mono text-[11px] text-[var(--gray-500)] hover:text-[var(--slate)] cursor-pointer transition-colors"
          >
            {label}
          </button>
        ))}
      </div>
      <span className="font-mono text-[10px] text-[var(--gray-500)]">
        HTML Design Skill v2
      </span>
    </footer>
  )
}
