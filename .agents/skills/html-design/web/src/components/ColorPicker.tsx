import { useConfigStore } from '../store/configStore'
import { useState } from 'react'

interface Props {
  dimensionId: string
  currentColor: string
}

const COLOR_PRESETS = [
  '#FAF9F5', '#FFFFFF', '#1A1A2E', '#0F0F23',
  '#0071E3', '#4F46E5', '#16A34A', '#7C3AED', '#EA580C',
  '#FF6B6B', '#F59E0B', '#06B6D4', '#EC4899',
  '#1D1D1F', '#4A4A4F', '#F5F5F7', '#86868B',
]

export default function ColorPicker({ dimensionId, currentColor }: Props) {
  const selectOption = useConfigStore((s) => s.selectOption)
  const dimensions = useConfigStore((s) => s.dimensions)
  const [hexInput, setHexInput] = useState(currentColor)
  const [isValid, setIsValid] = useState(true)

  const dim = dimensions.find((d) => d.id === dimensionId)!
  const customOption = dim.options.find((o) => o.id.includes('custom'))!

  const applyColor = (color: string) => {
    const normalized = color.startsWith('#') ? color : `#${color}`
    const valid = /^#[0-9a-fA-F]{6}$/.test(normalized)
    setIsValid(valid)
    setHexInput(normalized)

    if (valid) {
      const colorKey =
        dimensionId === 'color-bg' ? 'bg' :
        dimensionId === 'color-primary' ? 'primary' :
        dimensionId === 'color-text' ? 'text' : 'accent'
      customOption.defaults[colorKey] = normalized
      if (customOption.preview) customOption.preview[colorKey] = normalized
      selectOption(dimensionId, customOption.id)
    }
  }

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setHexInput(val)
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      applyColor(val)
    } else if (val.length >= 7) {
      setIsValid(false)
    }
  }

  const handleNativePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyColor(e.target.value)
  }

  return (
    <div className="flex flex-col gap-3 p-2 w-full">
      {/* Native color picker + hex input row */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={currentColor}
            onChange={handleNativePicker}
            className="w-8 h-8 rounded-md cursor-pointer border border-[var(--gray-300)]"
            style={{ borderWidth: 'var(--border-width)', padding: 0, background: 'none' }}
          />
        </div>
        <input
          type="text"
          value={hexInput}
          onChange={handleHexChange}
          placeholder="#000000"
          spellCheck={false}
          className={`flex-1 font-mono text-xs px-2 py-1.5 rounded-md border outline-none transition-colors ${
            isValid ? 'border-[var(--gray-300)] focus:border-[var(--gray-500)]' : 'border-red-400'
          }`}
          style={{ borderWidth: 'var(--border-width)' }}
        />
      </div>

      {/* Preview bar */}
      <div
        className="w-full h-6 rounded-md flex items-center justify-center text-[9px] font-mono transition-colors"
        style={{
          background: currentColor,
          color: isLightColor(currentColor) ? '#333' : '#fff',
          border: currentColor.toLowerCase() === '#ffffff' ? 'var(--border-width) solid var(--gray-300)' : 'none',
        }}
      >
        {isValid ? currentColor.toUpperCase() : '无效颜色'}
      </div>

      {/* Preset swatches */}
      <div className="flex flex-wrap gap-1.5">
        {COLOR_PRESETS.map((c) => (
          <button
            key={c}
            onClick={() => applyColor(c)}
            className="w-5 h-5 rounded-sm cursor-pointer border border-[var(--gray-300)] transition-transform hover:scale-110"
            style={{ background: c, borderWidth: 'var(--border-width)' }}
            title={c}
          />
        ))}
      </div>
    </div>
  )
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55
}
