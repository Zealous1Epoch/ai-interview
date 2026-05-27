import { useConfigStore } from '../store/configStore'
import type { DesignOption } from '../data/dimensions'
import ColorPicker from './ColorPicker'

interface Props {
  option: DesignOption
  dimensionId: string
}

export default function OptionCard({ option, dimensionId }: Props) {
  const selectOption = useConfigStore((s) => s.selectOption)
  const isSelected = useConfigStore((s) => s.selections[dimensionId]) === option.id

  return (
    <div
      onClick={() => selectOption(dimensionId, option.id)}
      className={`
        rounded-lg cursor-pointer transition-all bg-[var(--paper)] overflow-hidden
        ${isSelected
          ? 'border-[var(--clay)] ring-1 ring-[var(--clay)]/20'
          : 'border-[var(--gray-300)] hover:border-[var(--gray-500)]'
        }
      `}
      style={{
        borderWidth: 'var(--border-width)',
        borderStyle: 'solid',
      }}
    >
      {/* Demo area */}
      <div className="p-4 bg-[var(--gray-100)]">
        <OptionDemo option={option} dimensionId={dimensionId} />
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-[var(--slate)]">{option.label}</h3>
          {isSelected && (
            <span className="font-mono text-[10px] text-[var(--clay)] font-medium bg-[var(--clay)]/10 px-2 py-0.5 rounded-full">
              已选
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--gray-500)] leading-relaxed">{option.description}</p>
      </div>
    </div>
  )
}

function OptionDemo({ option, dimensionId }: Props) {
  const isColorDim = dimensionId.startsWith('color-')
  const colorKey =
    dimensionId === 'color-bg' ? 'bg' :
    dimensionId === 'color-primary' ? 'primary' :
    dimensionId === 'color-text' ? 'text' :
    dimensionId === 'color-accent' ? 'accent' : null
  const previewColor = colorKey ? option.preview?.[colorKey] : null

  // Color dimensions: show color swatch + hex
  if (isColorDim && previewColor) {
    if (option.id.includes('custom')) {
      return (
        <div className="h-28 flex items-center justify-center">
          <ColorPicker dimensionId={dimensionId} currentColor={previewColor} />
        </div>
      )
    }
    return (
      <div className="flex items-center gap-4 h-28">
        <div
          className="w-20 h-20 rounded-lg shadow-sm flex-shrink-0 border border-[var(--gray-300)]"
          style={{ background: previewColor, borderWidth: 'var(--border-width)' }}
        />
        <div className="flex flex-col gap-2">
          <div className="py-2 px-3 rounded-md font-mono text-xs" style={{
            background: previewColor,
            color: isLightColor(previewColor) ? '#141413' : '#fff',
            border: previewColor.toLowerCase() === '#ffffff' ? 'var(--border-width) solid var(--gray-300)' : 'none',
          }}>
            {previewColor}
          </div>
          <div className="flex gap-1.5">
            {[0.15, 0.3, 0.5, 0.7, 0.9].map((a) => (
              <div key={a} className="w-5 h-5 rounded-sm" style={{ background: previewColor, opacity: a }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Font dimension: show text sample
  if (dimensionId === 'font') {
    const fontMap: Record<string, string> = {
      'font-system': '-apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      'font-inter': "'Inter', sans-serif",
      'font-geist': "'Geist', sans-serif",
      'font-noto': "'Noto Sans SC', sans-serif",
    }
    const font = fontMap[option.id] ?? 'sans-serif'
    return (
      <div className="h-24 flex flex-col justify-center gap-2">
        <div style={{ fontFamily: font, fontWeight: 700, fontSize: 20, color: 'var(--slate)' }}>
          标题展示 Bold 20px
        </div>
        <div style={{ fontFamily: font, fontWeight: 400, fontSize: 13, color: 'var(--gray-500)' }}>
          正文 Regular 13px &middot; 数字 0123456789
        </div>
      </div>
    )
  }

  // Button style: show actual buttons
  if (dimensionId === 'button') {
    return (
      <div className="flex items-center gap-3 h-20">
        <div className={`
          px-5 py-2 rounded-full text-xs font-medium transition-all
          ${option.id === 'btn-solid' ? 'bg-[var(--clay)] text-white' : ''}
          ${option.id === 'btn-outline' ? 'border-2 border-[var(--clay)] text-[var(--clay)]' : ''}
          ${option.id === 'btn-ghost' ? 'text-[var(--gray-700)] hover:bg-[var(--gray-200)]' : ''}
          ${option.id === 'btn-gradient' ? 'bg-gradient-to-r from-[var(--clay)] to-[var(--olive)] text-white' : ''}
        `} style={{ borderWidth: option.id === 'btn-outline' ? '2px' : '0' }}>
          按钮样式
        </div>
      </div>
    )
  }

  // Card style: show mini card
  if (dimensionId === 'card') {
    return (
      <div className="h-24 flex items-center justify-center">
        <div className={`
          w-full max-w-[200px] p-3 rounded-lg text-xs
          ${option.id === 'card-border' ? 'bg-white border border-[var(--gray-300)]' : ''}
          ${option.id === 'card-shadow' ? 'bg-white shadow-md' : ''}
          ${option.id === 'card-glass' ? 'bg-white/60 backdrop-blur border border-white/40' : ''}
          ${option.id === 'card-flat' ? 'bg-transparent' : ''}
        `} style={{ borderWidth: option.id === 'card-border' ? 'var(--border-width)' : '0' }}>
          <div className="h-1.5 w-12 rounded-full mb-2" style={{ background: 'var(--clay)' }} />
          <div className="h-1 w-full rounded-full mb-1.5" style={{ background: 'var(--gray-300)' }} />
          <div className="h-1 w-3/4 rounded-full" style={{ background: 'var(--gray-200)' }} />
        </div>
      </div>
    )
  }

  // Input style: show actual inputs
  if (dimensionId === 'input') {
    return (
      <div className="h-20 flex items-center justify-center">
        <div className="w-full max-w-[200px]">
          {option.id === 'inp-border' && (
            <div className="px-3 py-2 rounded-md border border-[var(--gray-300)] text-xs text-[var(--gray-500)]"
              style={{ borderWidth: 'var(--border-width)' }}>输入框 (边框式)</div>
          )}
          {option.id === 'inp-underline' && (
            <div className="px-1 py-2 border-b-2 border-[var(--gray-300)] text-xs text-[var(--gray-500)]"
              style={{ borderBottomWidth: '2px' }}>输入框 (下划线式)</div>
          )}
          {option.id === 'inp-filled' && (
            <div className="px-3 py-2 rounded-md bg-[var(--gray-100)] text-xs text-[var(--gray-500)]">输入框 (填充式)</div>
          )}
        </div>
      </div>
    )
  }

  // Nav style: show mini nav
  if (dimensionId === 'nav') {
    return (
      <div className="h-20 flex items-center justify-center">
        <div className="w-full max-w-[200px]">
          {option.id === 'nav-top' && (
            <div className="rounded-md border border-[var(--gray-300)] p-2" style={{ borderWidth: 'var(--border-width)' }}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[var(--clay)]" />
                <div className="flex gap-2">
                  <div className="h-1 w-6 rounded bg-[var(--gray-300)]" />
                  <div className="h-1 w-6 rounded bg-[var(--gray-300)]" />
                </div>
              </div>
            </div>
          )}
          {option.id === 'nav-side' && (
            <div className="flex gap-1.5">
              <div className="w-10 rounded-md border border-[var(--gray-300)] p-1.5 flex flex-col gap-1"
                style={{ borderWidth: 'var(--border-width)' }}>
                <div className="h-1 rounded bg-[var(--gray-300)]" />
                <div className="h-1 rounded bg-[var(--gray-300)]" />
                <div className="h-1 rounded bg-[var(--gray-300)]" />
              </div>
              <div className="flex-1 rounded-md border border-[var(--gray-300)] p-1.5"
                style={{ borderWidth: 'var(--border-width)' }}>
                <div className="h-1 w-3/4 rounded bg-[var(--gray-300)]" />
              </div>
            </div>
          )}
          {option.id === 'nav-hamburger' && (
            <div className="rounded-md border border-[var(--gray-300)] p-2 flex items-center justify-between"
              style={{ borderWidth: 'var(--border-width)' }}>
              <div className="h-1 w-6 rounded bg-[var(--gray-300)]" />
              <div className="flex flex-col gap-0.5">
                <div className="w-3 h-0.5 rounded bg-[var(--gray-300)]" />
                <div className="w-3 h-0.5 rounded bg-[var(--gray-300)]" />
                <div className="w-3 h-0.5 rounded bg-[var(--gray-300)]" />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Icons: show icon samples
  if (dimensionId === 'icons') {
    return (
      <div className="h-20 flex items-center gap-4 justify-center">
        <div className="w-7 h-7 rounded-md border border-[var(--gray-300)] flex items-center justify-center"
          style={{ borderWidth: 'var(--border-width)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
        </div>
        <div className="w-7 h-7 rounded-md border border-[var(--gray-300)] flex items-center justify-center"
          style={{ borderWidth: 'var(--border-width)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
        </div>
        <div className="w-7 h-7 rounded-md border border-[var(--gray-300)] flex items-center justify-center"
          style={{ borderWidth: 'var(--border-width)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12,2 22,22 2,22"/></svg>
        </div>
      </div>
    )
  }

  // Table: show mini table
  if (dimensionId === 'table') {
    return (
      <div className="h-20 flex items-center justify-center">
        <div className="w-full max-w-[200px]">
          <table className="w-full text-[10px]">
            <thead>
              <tr className={option.id === 'tbl-lines' ? 'border-b-2 border-[var(--gray-300)]' : ''}>
                <td className="py-1 font-semibold text-[var(--gray-500)]">列A</td>
                <td className="py-1 font-semibold text-[var(--gray-500)]">列B</td>
              </tr>
            </thead>
            <tbody>
              <tr className={`
                ${option.id === 'tbl-striped' ? 'bg-[var(--gray-100)]' : ''}
                ${option.id === 'tbl-lines' ? 'border-b border-[var(--gray-200)]' : ''}
              `}>
                <td className="py-1 text-[var(--gray-700)]">数据1</td>
                <td className="py-1 text-[var(--gray-700)]">数据2</td>
              </tr>
              <tr className={option.id === 'tbl-lines' ? 'border-b border-[var(--gray-200)]' : ''}>
                <td className="py-1 text-[var(--gray-700)]">数据3</td>
                <td className="py-1 text-[var(--gray-700)]">数据4</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // Badge: show actual badges
  if (dimensionId === 'badge') {
    return (
      <div className="h-20 flex items-center gap-2 justify-center flex-wrap">
        {option.id === 'badge-filled' && (
          <>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#788C5D] text-white">成功</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#D97757] text-white">待处理</span>
          </>
        )}
        {option.id === 'badge-outline' && (
          <>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-[#788C5D] text-[#788C5D]" style={{ borderWidth: 'var(--border-width)' }}>成功</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-[#D97757] text-[#D97757]" style={{ borderWidth: 'var(--border-width)' }}>待处理</span>
          </>
        )}
        {option.id === 'badge-dot' && (
          <>
            <span className="flex items-center gap-1 text-[10px] text-[var(--gray-700)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#788C5D]" />成功
            </span>
            <span className="flex items-center gap-1 text-[10px] text-[var(--gray-700)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />待处理
            </span>
          </>
        )}
      </div>
    )
  }

  // Animation dimensions: show animated demo
  if (['hover', 'click', 'page-transition', 'loading', 'finish-effect', 'scroll-reveal', 'micro-interaction'].includes(dimensionId)) {
    return <AnimationDemo option={option} dimensionId={dimensionId} />
  }

  // Dark mode: show toggle demo
  if (dimensionId === 'dark-mode') {
    return (
      <div className="h-20 flex items-center gap-3 justify-center">
        <div className="w-16 h-10 rounded-full bg-[var(--gray-200)] p-1 flex items-center"
          style={{ justifyContent: option.id === 'dm-dark' ? 'flex-end' : 'flex-start' }}>
          <div className="w-8 h-8 rounded-full bg-white shadow-sm" />
        </div>
        <span className="text-xs text-[var(--gray-500)]">{option.label}</span>
      </div>
    )
  }

  // Fallback
  return (
    <div className="h-20 flex items-center justify-center">
      <span className="text-sm text-[var(--gray-500)]">{option.label}</span>
    </div>
  )
}

function AnimationDemo({ option, dimensionId }: Props) {
  // Hover animations
  if (dimensionId === 'hover') {
    return (
      <div className="h-24 flex items-center justify-center">
        <div className={`
          px-4 py-2 rounded-full text-xs font-medium bg-[var(--clay)] text-white cursor-pointer transition-all
          ${option.id === 'hover-lift' ? 'hover:-translate-y-1 hover:shadow-md' : ''}
          ${option.id === 'hover-scale' ? 'hover:scale-105' : ''}
          ${option.id === 'hover-glow' ? 'hover:shadow-lg hover:shadow-[var(--clay)]/30' : ''}
          ${option.id === 'hover-border' ? 'hover:ring-2 hover:ring-[var(--clay)]' : ''}
        `}>
          悬停试试 (hover)
        </div>
      </div>
    )
  }

  // Click feedback
  if (dimensionId === 'click') {
    return (
      <div className="h-24 flex items-center justify-center">
        <div className={`
          px-4 py-2 rounded-full text-xs font-medium bg-[var(--clay)] text-white cursor-pointer
          ${option.id === 'click-press' ? 'active:scale-95 transition-transform' : ''}
          ${option.id === 'click-color' ? 'active:bg-[var(--slate)] transition-colors' : ''}
        `}>
          {option.id === 'click-ripple' ? '点击涟漪' :
           option.id === 'click-press' ? '点按缩放 (点击试试)' :
           option.id === 'click-color' ? '颜色翻转 (点击试试)' :
           '无反馈'}
        </div>
      </div>
    )
  }

  // Page transitions
  if (dimensionId === 'page-transition') {
    return (
      <div className="h-20 flex items-center justify-center relative overflow-hidden bg-[var(--paper)] rounded-md">
        <div className="text-xs text-[var(--gray-500)] px-4 py-2 rounded border border-[var(--gray-300)]"
          style={{ borderWidth: 'var(--border-width)' }}>
          {option.id === 'pt-fade' ? '淡入淡出' : option.id === 'pt-slide' ? '滑动切换' : option.id === 'pt-zoom' ? '缩放切换' : '无动画'}
        </div>
      </div>
    )
  }

  // Loading
  if (dimensionId === 'loading') {
    return (
      <div className="h-20 flex items-center justify-center">
        {option.id === 'load-skeleton' && (
          <div className="flex flex-col gap-1.5 w-full max-w-[160px]">
            <div className="h-2.5 w-full rounded animate-pulse bg-[var(--gray-300)]" />
            <div className="h-2.5 w-4/5 rounded animate-pulse bg-[var(--gray-200)]" />
            <div className="h-2.5 w-3/5 rounded animate-pulse bg-[var(--gray-200)]" />
          </div>
        )}
        {option.id === 'load-spinner' && (
          <div className="w-6 h-6 border-2 border-[var(--gray-300)] border-t-[var(--clay)] rounded-full animate-spin" />
        )}
        {option.id === 'load-progress' && (
          <div className="w-full max-w-[160px] h-1.5 bg-[var(--gray-200)] rounded-full overflow-hidden">
            <div className="h-full w-2/3 rounded-full animate-pulse" style={{ background: 'linear-gradient(to right, var(--clay), var(--olive))' }} />
          </div>
        )}
        {option.id === 'load-pulse' && (
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[var(--gray-300)] animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-[var(--gray-300)] animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 rounded-full bg-[var(--gray-300)] animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        )}
      </div>
    )
  }

  // Finish effect
  if (dimensionId === 'finish-effect') {
    return (
      <div className="h-20 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-[#788C5D]/20 flex items-center justify-center">
          {option.id === 'finish-bounce' && (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#788C5D" strokeWidth="2.5" className="animate-bounce"><polyline points="20,6 9,17 4,12"/></svg>
          )}
          {option.id === 'finish-check' && (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#788C5D" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
          )}
          {option.id === 'finish-confetti' && (
            <div className="relative">
              <span className="text-lg">&#10003;</span>
            </div>
          )}
          {option.id === 'finish-none' && (
            <span className="text-xs text-[var(--gray-500)]">无动效</span>
          )}
        </div>
      </div>
    )
  }

  // Scroll reveal
  if (dimensionId === 'scroll-reveal') {
    return (
      <div className="h-20 flex items-center justify-center">
        <div className="flex gap-2 items-end">
          {[8, 16, 24].map((h, i) => (
            <div key={i}
              className={`
                w-6 rounded-t bg-[var(--clay)]/${30 + i * 20}
                ${option.id === 'sr-stagger' ? 'animate-bounce' : ''}
              `}
              style={{
                height: h,
                opacity: option.id === 'sr-fade-up' ? 0.5 + i * 0.25 : 1,
                transform: option.id === 'sr-scale' ? `scale(${0.8 + i * 0.1})` : 'none',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  // Micro interactions
  if (dimensionId === 'micro-interaction') {
    return (
      <div className="h-20 flex items-center justify-center">
        {option.id === 'mi-shake' && (
          <div className="px-3 py-1.5 rounded-md border border-red-300 bg-red-50 text-xs text-red-500 animate-[shake_0.4s_ease]">输入抖动</div>
        )}
        {option.id === 'mi-count' && (
          <div className="font-mono text-lg font-bold text-[var(--clay)] tabular-nums">42</div>
        )}
        {option.id === 'mi-slide-in' && (
          <div className="px-3 py-1.5 rounded-md bg-[var(--slate)] text-[var(--ivory)] text-xs">通知消息</div>
        )}
        {option.id === 'mi-none' && (
          <span className="text-xs text-[var(--gray-500)]">无微交互</span>
        )}
      </div>
    )
  }

  return null
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55
}
