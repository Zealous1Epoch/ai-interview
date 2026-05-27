import { type ConfigState } from '../store/configStore'
import { dimensions } from '../data/dimensions'

function fillTemplate(template: string, defaults: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => defaults[key] ?? `{${key}}`)
}

export function buildFullPrompt(state: ConfigState): string {
  const categoryLabels: Record<string, string> = {
    visual: '基础视觉',
    component: '组件样式',
    motion: '动效与交互',
  }

  const sections: string[] = ['# 设计规范\n']

  const categories = ['visual', 'component', 'motion'] as const

  for (const cat of categories) {
    const catDims = dimensions.filter((d) => d.category === cat)
    const catLines: string[] = []

    for (const dim of catDims) {
      const selected = state.selections[dim.id]
      if (selected == null) continue

      if (dim.controlType === 'slider' && dim.sliderConfig && typeof selected === 'number') {
        const fragment = dim.sliderConfig.promptTemplate(selected)
        catLines.push(`- ${fragment}`)
      } else if (typeof selected === 'string') {
        const option = dim.options.find((o) => o.id === selected)
        if (!option) continue
        const fragment = fillTemplate(option.promptTemplate, option.defaults)
        catLines.push(`- ${fragment}`)
      }
    }

    if (catLines.length > 0) {
      sections.push(`## ${categoryLabels[cat]}`)
      sections.push(catLines.join('\n'))
      sections.push('')
    }
  }

  sections.push('---\n')
  sections.push('请严格按照以上设计规范生成 HTML 页面。')

  return sections.join('\n')
}
