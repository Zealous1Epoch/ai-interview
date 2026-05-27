import { useConfigStore } from '../store/configStore'
import type { Dimension } from '../data/dimensions'

interface Props {
  dimension: Dimension
}

export default function SliderControl({ dimension }: Props) {
  const selections = useConfigStore((s) => s.selections)
  const setSliderValue = useConfigStore((s) => s.setSliderValue)

  const cfg = dimension.sliderConfig!
  const currentValue = (selections[dimension.id] as number) ?? cfg.defaultValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(dimension.id, Number(e.target.value))
    // Update CSS variable on document root
    const cssVar = cfg.cssVar
    if (dimension.id === 'border-radius') {
      document.documentElement.style.setProperty(cssVar, `${e.target.value}px`)
    } else if (dimension.id === 'spacing') {
      document.documentElement.style.setProperty(cssVar, `${e.target.value}px`)
    } else if (dimension.id === 'shadow') {
      const v = Number(e.target.value)
      if (v === 0) {
        document.documentElement.style.setProperty('--design-shadow-color', 'transparent')
        document.documentElement.style.setProperty('--design-shadow-blur', '0px')
        document.documentElement.style.setProperty('--design-shadow-y', '0px')
      } else {
        const alpha = v / 30
        document.documentElement.style.setProperty('--design-shadow-color', `rgba(20,20,19,${alpha.toFixed(2)})`)
        document.documentElement.style.setProperty('--design-shadow-blur', `${v * 1.5}px`)
        document.documentElement.style.setProperty('--design-shadow-y', `${v * 0.3}px`)
      }
    }
  }

  const percentage = ((currentValue - cfg.min) / (cfg.max - cfg.min)) * 100

  return (
    <>
      <div>
        <div className="eyebrow mb-2">当前设置</div>
        <div className="serif-heading text-lg mb-1">{cfg.promptLabel(currentValue)}</div>
        <p className="text-xs text-[var(--gray-500)] leading-relaxed">
          {cfg.promptTemplate(currentValue)}
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="font-mono text-xs text-[var(--gray-500)]">
              {cfg.min}{cfg.unit}
            </span>
            <span className="font-mono text-sm font-semibold text-[var(--slate)] bg-[var(--gray-100)] px-3 py-1.5 rounded-md border border-[var(--gray-300)]" style={{ borderWidth: 'var(--border-width)' }}>
              {currentValue}{cfg.unit}
            </span>
            <span className="font-mono text-xs text-[var(--gray-500)]">
              {cfg.max}{cfg.unit}
            </span>
          </div>

          <input
            type="range"
            min={cfg.min}
            max={cfg.max}
            step={cfg.step}
            value={currentValue}
            onChange={handleChange}
            style={{
              background: `linear-gradient(to right, var(--clay) 0%, var(--clay) ${percentage}%, var(--gray-200) ${percentage}%, var(--gray-200) 100%)`,
            }}
          />

          {/* Tick marks */}
          <div className="flex justify-between mt-2 px-1">
            {[0, 25, 50, 75, 100].map((p) => {
              const val = Math.round(cfg.min + (cfg.max - cfg.min) * p / 100)
              return (
                <button
                  key={p}
                  onClick={() => setSliderValue(dimension.id, val)}
                  className="font-mono text-[10px] text-[var(--gray-500)] hover:text-[var(--clay)] cursor-pointer transition-colors"
                >
                  {val}
                </button>
              )
            })}
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap gap-2">
          {[cfg.min, cfg.defaultValue, cfg.max].map((val) => (
            <button
              key={val}
              onClick={() => setSliderValue(dimension.id, val)}
              className={`font-mono text-[11px] px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
                currentValue === val
                  ? 'bg-[var(--slate)] text-[var(--ivory)] border-[var(--slate)]'
                  : 'text-[var(--gray-500)] border-[var(--gray-300)] hover:border-[var(--gray-500)]'
              }`}
              style={{ borderWidth: 'var(--border-width)' }}
            >
              {cfg.promptLabel(val)}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
