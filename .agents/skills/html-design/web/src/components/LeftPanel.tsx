import { useConfigStore } from '../store/configStore'

export default function LeftPanel() {
  const dimensions = useConfigStore((s) => s.dimensions)
  const activeDimensionId = useConfigStore((s) => s.activeDimensionId)
  const setActiveDimension = useConfigStore((s) => s.setActiveDimension)
  const selections = useConfigStore((s) => s.selections)

  const categories = [
    { key: 'visual' as const, label: '基础视觉' },
    { key: 'component' as const, label: '组件样式' },
    { key: 'motion' as const, label: '动效交互' },
  ]

  const selectedCount = Object.values(selections).filter((v) => v != null).length

  return (
    <aside
      className="w-[252px] bg-[var(--paper)] border-r border-[var(--gray-300)] flex flex-col flex-shrink-0 select-none"
      style={{ borderWidth: 'var(--border-width)' }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="eyebrow">设计配置器</div>
        <h2 className="serif-heading text-[22px] text-[var(--slate)] m-0 leading-tight">
          设计维度
        </h2>
        <div className="font-mono text-[11px] text-[var(--gray-500)] mt-1">
          步骤 1/2 &middot; 选择参数
        </div>
      </div>

      {/* Dimension list */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-1">
        {categories.map((cat) => {
          const catDims = dimensions.filter((d) => d.category === cat.key)
          return (
            <div key={cat.key} className="mb-5">
              {/* Category header */}
              <div className="flex items-center gap-2 px-2.5 mb-2">
                <span className="text-xs font-semibold text-[var(--gray-500)] tracking-wider uppercase">
                  {cat.label}
                </span>
                <span className="h-px flex-1 bg-[var(--gray-200)]" />
                <span className="font-mono text-[10px] text-[var(--gray-500)]">
                  {catDims.filter((d) => selections[d.id] != null).length}/{catDims.length}
                </span>
              </div>

              {catDims.map((d) => {
                const isSet = selections[d.id] != null
                const isActive = activeDimensionId === d.id
                const isSlider = d.controlType === 'slider'
                const sliderCfg = d.sliderConfig
                const selectedOption = typeof selections[d.id] === 'string'
                  ? d.options.find((o) => o.id === selections[d.id])
                  : null

                return (
                  <div
                    key={d.id}
                    onClick={() => setActiveDimension(isActive ? null : d.id)}
                    className={`
                      group px-3 py-2 rounded-md cursor-pointer transition-all mb-0.5
                      ${isActive
                        ? 'bg-[var(--gray-100)]'
                        : 'hover:bg-[var(--gray-100)]'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`
                        text-sm truncate max-w-[120px]
                        ${isActive
                          ? 'text-[var(--slate)] font-semibold'
                          : 'text-[var(--gray-700)] font-normal'
                        }
                      `}>
                        {d.label}
                      </span>
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
                        {isSlider && sliderCfg && (
                          <span className="font-mono text-[10px] text-[var(--gray-500)] bg-[var(--gray-200)]/50 px-1.5 py-0.5 rounded whitespace-nowrap">
                            {sliderCfg.promptLabel(selections[d.id] as number ?? sliderCfg.defaultValue)}
                          </span>
                        )}
                        {isSet && !isSlider && selectedOption && (
                          <span className="text-[10px] text-[var(--gray-500)] bg-[var(--gray-200)]/50 px-1.5 py-0.5 rounded max-w-[70px] truncate">
                            {selectedOption.label}
                          </span>
                        )}
                        {isSet && !isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)] flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-3 border-t border-[var(--gray-300)] flex items-center justify-between"
        style={{ borderWidth: 'var(--border-width)' }}
      >
        <span className="text-xs text-[var(--gray-500)]">
          <span className="font-semibold text-[var(--slate)]">{selectedCount}</span>
          <span className="font-mono text-[11px]">/{dimensions.length} 已选</span>
        </span>
      </div>
    </aside>
  )
}
