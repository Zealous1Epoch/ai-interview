import { useConfigStore } from '../store/configStore'
import { dimensions, type Dimension } from '../data/dimensions'
import { useMemo } from 'react'

interface Props {
  benchMode?: boolean
  sliderDim?: Dimension
}

export default function LivePreview({ benchMode, sliderDim }: Props) {
  const selections = useConfigStore((s) => s.selections)
  const demoType = useConfigStore((s) => s.demoType)

  const styles = useMemo(() => {
    const bg = getColor(selections, 'color-bg', '#FAF9F5')
    const primary = getColor(selections, 'color-primary', '#0071e3')
    const text = getColor(selections, 'color-text', '#1d1d1f')
    const accent = getColor(selections, 'color-accent', '#f59e0b')
    const radius = typeof selections['border-radius'] === 'number' ? selections['border-radius'] : 10
    const spacing = typeof selections['spacing'] === 'number' ? selections['spacing'] : 8
    const shadowVal = typeof selections['shadow'] === 'number' ? selections['shadow'] : 4
    const font = getFont(selections)

    return { bg, primary, text, accent, radius, spacing, shadowVal, font }
  }, [selections])

  // Bench mode: show a focused demo for the current slider dimension
  if (benchMode && sliderDim) {
    return (
      <div className="w-full max-w-md" style={{ background: styles.bg, padding: styles.spacing * 4, borderRadius: styles.radius }}>
        {sliderDim.id === 'border-radius' && (
          <div className="flex flex-col gap-4">
            <div style={{ padding: styles.spacing * 2, background: styles.primary, color: '#fff', borderRadius: styles.radius, textAlign: 'center', fontFamily: styles.font.body, fontSize: 14 }}>
              按钮 / 标签圆角预览
            </div>
            <div style={{ padding: styles.spacing * 3, background: '#fff', border: `var(--border-width) solid var(--gray-300)`, borderRadius: styles.radius }}>
              <div style={{ fontFamily: styles.font.heading, fontSize: 18, marginBottom: styles.spacing, color: styles.text }}>卡片标题</div>
              <div style={{ fontFamily: styles.font.body, fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.6 }}>
                这段文字展示了当前圆角设置下的卡片效果。圆角值：{styles.radius}px
              </div>
            </div>
            <div style={{ display: 'flex', gap: styles.spacing }}>
              <input style={{ flex: 1, padding: styles.spacing * 1.5, border: `var(--border-width) solid var(--gray-300)`, borderRadius: styles.radius, fontFamily: styles.font.body, fontSize: 13 }} placeholder="输入框预览" />
            </div>
          </div>
        )}
        {sliderDim.id === 'shadow' && (
          <div className="flex flex-col gap-4">
            {[0.5, 1, 1.5].map((scale) => {
              const val = styles.shadowVal * scale
              const alpha = val / 30
              const blur = val * 1.5
              const y = val * 0.3
              const shadow = val === 0 ? 'none' : `0 ${y}px ${blur}px rgba(20,20,19,${alpha.toFixed(2)})`
              return (
                <div key={scale} style={{
                  padding: styles.spacing * 3,
                  background: '#fff',
                  border: `var(--border-width) solid var(--gray-300)`,
                  borderRadius: styles.radius,
                  boxShadow: shadow,
                  transition: 'box-shadow 0.3s',
                }}>
                  <div style={{ fontFamily: styles.font.body, fontSize: 13, color: styles.text }}>
                    阴影强度 {(val).toFixed(0)} / 20
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {sliderDim.id === 'spacing' && (
          <div className="flex flex-col" style={{ gap: styles.spacing }}>
            <div style={{ fontFamily: styles.font.heading, fontSize: 16, color: styles.text, marginBottom: styles.spacing }}>间距感知演示</div>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                padding: styles.spacing * 2,
                background: i === 2 ? styles.primary : '#fff',
                color: i === 2 ? '#fff' : styles.text,
                border: i !== 2 ? `var(--border-width) solid var(--gray-300)` : 'none',
                borderRadius: styles.radius / 2,
                fontFamily: styles.font.body,
                fontSize: 13,
                transition: 'all 0.2s',
              }}>
                元素 {i}：当前间距 {styles.spacing}px
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Full mode: show demo page
  const demoStyles = `
    <style>
      :root {
        --demo-bg: ${styles.bg};
        --demo-primary: ${styles.primary};
        --demo-text: ${styles.text};
        --demo-accent: ${styles.accent};
        --demo-radius: ${styles.radius}px;
        --demo-spacing: ${styles.spacing}px;
        --demo-shadow: ${styles.shadowVal === 0 ? 'none' : `0 ${styles.shadowVal * 0.3}px ${styles.shadowVal * 1.5}px rgba(20,20,19,${(styles.shadowVal / 30).toFixed(2)})`};
      }
      * { box-sizing: border-box; margin: 0; }
      body { font-family: ${styles.font.body}; background: var(--demo-bg); color: var(--demo-text); line-height: 1.6; padding: var(--demo-spacing) 0; }
      .wrap { max-width: 720px; margin: 0 auto; padding: 0 calc(var(--demo-spacing) * 3); }
      header { padding: calc(var(--demo-spacing) * 4) 0; text-align: center; border-bottom: var(--border-width) solid var(--gray-300); margin-bottom: calc(var(--demo-spacing) * 4); }
      h1 { font-family: ${styles.font.heading}; font-size: 32px; font-weight: 700; margin-bottom: var(--demo-spacing); }
      p.sub { color: #87867F; font-size: 15px; max-width: 480px; margin: 0 auto; }
      .btn { display: inline-flex; padding: calc(var(--demo-spacing) * 1.5) calc(var(--demo-spacing) * 3); background: var(--demo-primary); color: #fff; border: none; border-radius: var(--demo-radius); font-family: ${styles.font.body}; font-size: 14px; font-weight: 500; cursor: pointer; box-shadow: var(--demo-shadow); transition: transform 0.3s ease, box-shadow 0.3s ease; }
      .btn:hover { transform: translateY(-3px); box-shadow: ${styles.shadowVal === 0 ? 'none' : `0 ${styles.shadowVal * 0.5}px ${styles.shadowVal * 2}px rgba(20,20,19,${((styles.shadowVal + 4) / 30).toFixed(2)})`}; }
      .card { background: #fff; border: var(--border-width) solid var(--gray-300); border-radius: var(--demo-radius); padding: calc(var(--demo-spacing) * 2.5); box-shadow: var(--demo-shadow); transition: transform 0.3s ease, box-shadow 0.3s ease; }
      .card:hover { transform: translateY(-3px); box-shadow: ${styles.shadowVal === 0 ? 'none' : `0 ${styles.shadowVal * 0.5}px ${styles.shadowVal * 2}px rgba(20,20,19,${((styles.shadowVal + 4) / 30).toFixed(2)})`}; }
      .grid { display: grid; grid-template-columns: repeat(3,1fr); gap: var(--demo-spacing); margin: calc(var(--demo-spacing) * 4) 0; }
      .stat { font-size: 28px; font-weight: 700; color: var(--demo-primary); }
      .badge { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #87867F; }
      .badge::before { content:''; width: 8px; height: 8px; border-radius: 50%; }
      .badge.ok::before { background: #788C5D; }
      .badge.warn::before { background: var(--demo-accent); }
      .input { width: 100%; padding: calc(var(--demo-spacing) * 1.5); background: rgba(0,0,0,0.03); border: none; border-bottom: 2px solid transparent; border-radius: calc(var(--demo-radius) / 3) calc(var(--demo-radius) / 3) 0 0; font-family: ${styles.font.body}; font-size: 14px; outline: none; transition: border-color 0.2s; }
      .input:focus { border-bottom-color: var(--demo-accent); background: rgba(0,0,0,0.01); }
      @media(max-width:600px){ .grid{grid-template-columns:1fr;} }
    </style>
  `

  const marketingBody = `
    <div class="wrap">
      <header>
        <h1>打造卓越的数字体验</h1>
        <p class="sub">从设计到上线的一站式解决方案，让产品脱颖而出。</p>
        <div style="margin-top:calc(var(--demo-spacing)*3);display:flex;gap:var(--demo-spacing);justify-content:center;">
          <button class="btn">立即开始</button>
          <button class="btn" style="background:transparent;color:var(--demo-primary);border:var(--border-width) solid var(--demo-primary);">了解更多</button>
        </div>
      </header>
      <div style="display:flex;gap:16px;justify-content:center;margin-bottom:calc(var(--demo-spacing)*4);">
        <span class="badge ok">运行正常</span>
        <span class="badge warn">3项待处理</span>
        <span class="badge" style="--c:#D97757;">1项异常</span>
      </div>
      <div class="grid">
        <div class="card">
          <div class="stat">99.9%</div>
          <div style="font-weight:600;margin:8px 0 4px;">高可用性</div>
          <div style="color:#87867F;font-size:13px;">全年稳定运行保障</div>
        </div>
        <div class="card">
          <div class="stat">&lt;50ms</div>
          <div style="font-weight:600;margin:8px 0 4px;">极速响应</div>
          <div style="color:#87867F;font-size:13px;">全球边缘节点部署</div>
        </div>
        <div class="card">
          <div class="stat">100K+</div>
          <div style="font-weight:600;margin:8px 0 4px;">活跃用户</div>
          <div style="color:#87867F;font-size:13px;">日处理请求破亿</div>
        </div>
      </div>
      <div class="card" style="max-width:400px;margin:0 auto;">
        <div style="font-weight:600;margin-bottom:var(--demo-spacing);">快速注册</div>
        <input class="input" placeholder="you@example.com" style="margin-bottom:var(--demo-spacing);">
        <input class="input" type="password" placeholder="密码" style="margin-bottom:var(--demo-spacing);">
        <button class="btn" style="width:100%;">注册账号</button>
      </div>
    </div>
  `

  const dashboardBody = `
    <div class="wrap">
      <header>
        <h1>数据概览</h1>
        <p class="sub">项目运行状态一览</p>
      </header>
      <div class="grid">
        <div class="card"><div class="stat">1,234</div><div style="color:#87867F;font-size:13px;">今日访问</div><div style="color:var(--demo-accent);font-size:12px;margin-top:4px;">+12.5%</div></div>
        <div class="card"><div class="stat">89</div><div style="color:#87867F;font-size:13px;">活跃任务</div><div style="color:#788C5D;font-size:12px;margin-top:4px;">正常运行</div></div>
        <div class="card"><div class="stat">3</div><div style="color:#87867F;font-size:13px;">待处理告警</div></div>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-top:calc(var(--demo-spacing)*4);">
        <thead><tr style="border-bottom:2px solid #E6E3DA;"><th style="text-align:left;padding:var(--demo-spacing);font-size:12px;color:#87867F;font-weight:500;">项目</th><th style="text-align:left;padding:var(--demo-spacing);font-size:12px;color:#87867F;font-weight:500;">状态</th><th style="text-align:left;padding:var(--demo-spacing);font-size:12px;color:#87867F;font-weight:500;">时间</th></tr></thead>
        <tbody>
          <tr style="border-bottom:1px solid #E6E3DA;"><td style="padding:var(--demo-spacing);font-size:13px;">web-app</td><td style="padding:var(--demo-spacing);"><span class="badge ok">成功</span></td><td style="padding:var(--demo-spacing);font-size:12px;color:#87867F;">2分钟前</td></tr>
          <tr style="border-bottom:1px solid #E6E3DA;"><td style="padding:var(--demo-spacing);font-size:13px;">api-server</td><td style="padding:var(--demo-spacing);"><span class="badge ok">成功</span></td><td style="padding:var(--demo-spacing);font-size:12px;color:#87867F;">15分钟前</td></tr>
        </tbody>
      </table>
    </div>
  `

  const blogBody = `
    <div class="wrap">
      <header style="text-align:left;">
        <h1>设计系统的构建之道</h1>
        <p class="sub" style="margin:var(--demo-spacing) 0 0;">2026年5月27日 &middot; 8分钟阅读</p>
      </header>
      <div style="max-width:600px;">
        <p style="line-height:1.9;color:#3D3D3A;margin-bottom:var(--demo-spacing);">
          构建一个可扩展的设计系统，不仅仅是定义颜色和字体，更是在建立一套团队协作的通用语言。好的设计系统让设计师和开发者能够高效协作，保证产品的一致性。
        </p>
        <blockquote style="background:#F0EEE6;border-left:3px solid var(--demo-accent);padding:var(--demo-spacing) calc(var(--demo-spacing)*2);margin:calc(var(--demo-spacing)*2) 0;border-radius:0 calc(var(--demo-radius)/3) calc(var(--demo-radius)/3) 0;font-style:italic;">
          设计系统不是一次性的项目，而是一个持续演进的产品。
        </blockquote>
        <h2 style="font-family:${styles.font.heading};font-size:20px;margin:calc(var(--demo-spacing)*3) 0 var(--demo-spacing);">从组件开始</h2>
        <p style="line-height:1.9;color:#3D3D3A;">
          组件是设计系统的最小构建单元。良好的组件库应包含按钮、输入框、卡片等基础元素，并支持灵活的变体和主题定制。
        </p>
      </div>
    </div>
  `

  const body = demoType === 'dashboard' ? dashboardBody : demoType === 'blog' ? blogBody : marketingBody

  return (
    <div
      className="w-full rounded-lg overflow-hidden"
      style={{
        background: styles.bg,
        border: `var(--border-width) solid var(--gray-300)`,
        minHeight: benchMode ? 320 : 440,
      }}
      dangerouslySetInnerHTML={{
        __html: `${demoStyles}${body}`,
      }}
    />
  )
}

function getColor(selections: Record<string, string | number | null>, dimId: string, fallback: string): string {
  const optId = selections[dimId]
  if (!optId || typeof optId !== 'string') return fallback
  const dim = dimensions.find((d) => d.id === dimId)
  const opt = dim?.options.find((o) => o.id === optId)
  if (!opt) return fallback
  const colorKey = dimId === 'color-bg' ? 'bg' : dimId === 'color-primary' ? 'primary' : dimId === 'color-text' ? 'text' : 'accent'
  return (opt.defaults[colorKey] as string) ?? fallback
}

function getFont(selections: Record<string, string | number | null>) {
  const optId = selections['font']
  const isNoto = optId === 'font-noto'
  if (isNoto) return {
    heading: "'Noto Sans SC', sans-serif",
    body: "'Noto Sans SC', sans-serif",
  }
  const isSystem = optId === 'font-system' || !optId
  return {
    heading: isSystem ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'Inter, sans-serif',
    body: isSystem ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'Inter, sans-serif',
  }
}
