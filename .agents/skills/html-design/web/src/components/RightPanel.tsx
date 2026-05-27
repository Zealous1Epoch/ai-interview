import { useConfigStore } from '../store/configStore'
import { buildFullPrompt } from '../utils/promptBuilder'
import { useState } from 'react'

export default function RightPanel() {
  const fullPrompt = useConfigStore(buildFullPrompt)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleFinish = async () => {
    try {
      const res = await fetch('/api/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      })
      if (res.ok) {
        window.close()
      }
    } catch {
      await handleCopy()
      alert('结果已复制到剪贴板')
    }
  }

  const selectedCount = Object.values(useConfigStore((s) => s.selections)).filter((v) => v != null).length

  return (
    <aside
      className="w-[300px] bg-[var(--paper)] border-l border-[var(--gray-300)] flex flex-col flex-shrink-0"
      style={{ borderWidth: 'var(--border-width)' }}
    >
      <div className="p-5 pb-3 flex items-center justify-between">
        <div>
          <div className="eyebrow mb-0.5">生成结果</div>
          <h2 className="serif-heading text-lg m-0">提示词</h2>
        </div>
        <span className="font-mono text-[11px] text-[var(--clay)] font-medium bg-[var(--gray-100)] px-2 py-1 rounded-full">
          已选 {selectedCount}
        </span>
      </div>

      {/* Prompt display */}
      <div className="flex-1 mx-4 rounded-lg bg-[var(--slate)] text-[#c8d6c0] font-mono text-xs p-4 overflow-y-auto leading-relaxed whitespace-pre-wrap border" style={{ borderWidth: 'var(--border-width)', borderColor: 'var(--gray-700)' }}>
        {fullPrompt || (
          <span className="text-[var(--gray-500)]">在左侧选择设计参数，提示词将在此实时生成...</span>
        )}
      </div>

      {/* Action buttons */}
      <div className="p-4 flex gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 py-2.5 px-4 rounded-full font-mono text-xs cursor-pointer transition-all border border-[var(--gray-300)] text-[var(--gray-700)] hover:text-[var(--slate)] hover:border-[var(--gray-500)]"
          style={{ borderWidth: 'var(--border-width)' }}
        >
          {copied ? '已复制' : '复制 Prompt'}
        </button>
        <button
          onClick={handleFinish}
          className="flex-1 py-2.5 px-4 rounded-full font-mono text-xs cursor-pointer transition-all bg-[var(--slate)] text-[var(--ivory)] border border-[var(--slate)] hover:bg-[var(--gray-700)]"
          style={{ borderWidth: 'var(--border-width)' }}
        >
          完成并返回
        </button>
      </div>
    </aside>
  )
}
