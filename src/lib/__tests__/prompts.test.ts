import { describe, it, expect } from 'vitest'
import { buildInterviewSystemPrompt, buildInterviewContext, buildPracticePrompt } from '../prompts'

describe('buildInterviewSystemPrompt', () => {
  it('returns a string containing the stage instruction for self-intro', () => {
    const prompt = buildInterviewSystemPrompt('self-intro')
    expect(prompt).toContain('自我介绍')
    expect(prompt).toContain('专业、温和的技术面试官')
  })

  it('returns a string for ended stage', () => {
    const prompt = buildInterviewSystemPrompt('ended')
    expect(prompt).toContain('面试已结束')
  })

  it('includes the base system prompt for any stage', () => {
    const prompt = buildInterviewSystemPrompt('tech-qa')
    expect(prompt).toContain('50-150 字')
  })
})

describe('buildInterviewContext', () => {
  it('includes position, direction, and resume', () => {
    const ctx = buildInterviewContext(
      '前端工程师',
      'technical',
      '张三的简历内容...',
      ''
    )
    expect(ctx).toContain('前端工程师')
    expect(ctx).toContain('technical')
    expect(ctx).toContain('张三的简历内容...')
  })

  it('shows placeholder when history is empty', () => {
    const ctx = buildInterviewContext('PM', 'general', '简历', '')
    expect(ctx).toContain('尚无对话')
  })

  it('includes history messages when provided', () => {
    const ctx = buildInterviewContext('PM', 'general', '简历', '面试官: 你好\n候选人: 您好')
    expect(ctx).toContain('面试官: 你好')
  })
})

describe('buildPracticePrompt', () => {
  it('includes networking topic', () => {
    expect(buildPracticePrompt('networking')).toContain('计算机网络')
  })

  it('includes STAR guidance for behavioral', () => {
    expect(buildPracticePrompt('behavioral')).toContain('STAR')
  })

  it('falls back to raw type string for unknown type', () => {
    expect(buildPracticePrompt('unknown-type')).toContain('unknown-type')
  })
})
