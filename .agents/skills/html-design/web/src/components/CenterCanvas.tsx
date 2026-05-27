import { useConfigStore } from '../store/configStore'
import OptionCard from './OptionCard'
import SliderControl from './SliderControl'
import LivePreview from './LivePreview'
import { useState } from 'react'

export default function CenterCanvas() {
  const activeDimensionId = useConfigStore((s) => s.activeDimensionId)
  const dimensions = useConfigStore((s) => s.dimensions)
  const selections = useConfigStore((s) => s.selections)

  const [showPreview, setShowPreview] = useState(false)

  const activeDimension = dimensions.find((d) => d.id === activeDimensionId)
  const isSlider = activeDimension?.controlType === 'slider'
  const selectedCount = Object.values(selections).filter((v) => v != null).length

  const handleGeneratePreview = () => {
    setShowPreview(true)
  }

  // Show final preview
  if (showPreview) {
    return (
      <main className="flex-1 flex flex-col min-w-0 bg-[var(--ivory)]">
        <header
          className="px-6 py-4 border-b border-[var(--gray-300)] flex items-center justify-between"
          style={{ borderWidth: 'var(--border-width)' }}
        >
          <div className="flex items-center gap-4">
            <span className="eyebrow">步骤 2/2</span>
            <h2 className="serif-heading text-xl m-0">最终预览</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(false)}
              className="font-mono text-xs px-3 py-1.5 rounded-full border border-[var(--gray-300)] text-[var(--gray-500)] hover:text-[var(--slate)] hover:border-[var(--gray-500)] cursor-pointer transition-colors"
              style={{ borderWidth: 'var(--border-width)' }}
            >
              返回选择
            </button>
            {(['marketing', 'dashboard', 'blog'] as const).map((t) => (
              <button
                key={t}
                onClick={() => useConfigStore.getState().setDemoType(t)}
                className="font-mono text-xs px-3 py-1.5 rounded-full border border-[var(--gray-300)] text-[var(--gray-500)] hover:text-[var(--gray-500)] cursor-pointer transition-colors"
                style={{ borderWidth: 'var(--border-width)' }}
              >
                {t === 'marketing' ? '营销页' : t === 'dashboard' ? '仪表盘' : '博客'}
              </button>
            ))}
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <LivePreview />
        </div>
      </main>
    )
  }

  // Browsing a slider dimension: bench mode
  if (activeDimension && isSlider) {
    return (
      <main className="flex-1 flex flex-col min-w-0 bg-[var(--ivory)]">
        <header
          className="px-6 py-4 border-b border-[var(--gray-300)] flex items-center gap-4"
          style={{ borderWidth: 'var(--border-width)' }}
        >
          <span className="eyebrow">
            {activeDimension.category === 'visual' ? '基础视觉' :
             activeDimension.category === 'component' ? '组件样式' : '动效交互'}
          </span>
          <h2 className="serif-heading text-xl m-0">{activeDimension.label}</h2>
          <span className="font-mono text-[11px] text-[var(--gray-500)]">拖动滑块调节参数</span>
          <div className="flex-1" />
          <button
            onClick={handleGeneratePreview}
            className="px-4 py-2 rounded-full font-mono text-xs cursor-pointer transition-all bg-[var(--slate)] text-[var(--ivory)] hover:bg-[var(--gray-700)]"
          >
            生成预览 ({selectedCount}/23)
          </button>
        </header>
        <div className="flex-1 flex">
          <div className="flex-1 flex items-center justify-center p-8 bg-[var(--paper)]">
            <LivePreview benchMode sliderDim={activeDimension} />
          </div>
          <div
            className="w-[272px] border-l border-[var(--gray-300)] p-5 bg-[var(--ivory)] flex flex-col gap-4"
            style={{ borderWidth: 'var(--border-width)' }}
          >
            <SliderControl dimension={activeDimension} />
          </div>
        </div>
      </main>
    )
  }

  // Browsing an option dimension: show option cards
  if (activeDimension) {
    return (
      <main className="flex-1 flex flex-col min-w-0 bg-[var(--ivory)]">
        <header
          className="px-6 py-4 border-b border-[var(--gray-300)] flex items-center gap-4"
          style={{ borderWidth: 'var(--border-width)' }}
        >
          <span className="eyebrow">
            {activeDimension.category === 'visual' ? '基础视觉' :
             activeDimension.category === 'component' ? '组件样式' : '动效交互'}
          </span>
          <h2 className="serif-heading text-xl m-0">{activeDimension.label}</h2>
          <span className="font-mono text-[11px] text-[var(--gray-500)]">
            {activeDimension.options.length} 个选项
          </span>
          <div className="flex-1" />
          <button
            onClick={handleGeneratePreview}
            className="px-4 py-2 rounded-full font-mono text-xs cursor-pointer transition-all bg-[var(--slate)] text-[var(--ivory)] hover:bg-[var(--gray-700)]"
          >
            生成预览 ({selectedCount}/23)
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-4">
            {activeDimension.options.map((opt) => (
              <OptionCard
                key={opt.id}
                option={opt}
                dimensionId={activeDimension.id}
              />
            ))}
          </div>
        </div>
      </main>
    )
  }

  // Idle state: show overview and "generate preview" button
  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[var(--ivory)] items-center justify-center">
      <div className="text-center max-w-md">
        <div className="eyebrow mb-3">步骤 1/2</div>
        <h2 className="serif-heading text-[28px] text-[var(--slate)] mb-2 leading-tight">
          选择设计参数
        </h2>
        <p className="text-sm text-[var(--gray-500)] mb-8 leading-relaxed">
          在左侧面板浏览 23 个设计维度，点击进入查看可视化选项。
          每个选项都有实时 Demo 供参考。
        </p>

        {/* Progress summary */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-[11px] text-[var(--gray-500)]">完成度</span>
            <span className="font-mono text-[11px] font-semibold text-[var(--slate)]">{selectedCount}/23</span>
          </div>
          <div className="h-2 bg-[var(--gray-200)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(selectedCount / dimensions.length) * 100}%`,
                background: 'linear-gradient(90deg, var(--clay), var(--olive))',
              }}
            />
          </div>
        </div>

        <button
          onClick={handleGeneratePreview}
          disabled={selectedCount === 0}
          className={`
            px-8 py-3 rounded-full font-mono text-sm cursor-pointer transition-all border-none
            ${selectedCount === 0
              ? 'bg-[var(--gray-200)] text-[var(--gray-500)] cursor-not-allowed'
              : 'bg-[var(--slate)] text-[var(--ivory)] hover:bg-[var(--gray-700)] shadow-sm hover:shadow-md'}
          `}
        >
          {selectedCount === 0 ? '请先选择设计参数' : `生成预览 (${selectedCount}/23 已选)`}
        </button>

        {/* Quick selection counts by category */}
        <div className="mt-8 flex gap-6 justify-center">
          {[
            { label: '基础视觉', key: 'visual' },
            { label: '组件样式', key: 'component' },
            { label: '动效交互', key: 'motion' },
          ].map(({ label, key }) => {
            const catTotal = dimensions.filter((d) => d.category === key).length
            const catSelected = dimensions.filter((d) => d.category === key && selections[d.id] != null).length
            return (
              <div key={key} className="text-center">
                <div className="font-mono text-lg font-semibold text-[var(--slate)]">{catSelected}/{catTotal}</div>
                <div className="text-[10px] text-[var(--gray-500)] uppercase tracking-wider">{label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
