import { describe, it, expect } from 'vitest'
import { generateId, formatDuration, formatDate, parseStageTag, averageScore, getStars } from '../utils'

describe('generateId', () => {
  it('returns a non-empty string', () => {
    expect(generateId().length).toBeGreaterThan(0)
  })

  it('returns unique values on successive calls', () => {
    const ids = Array.from({ length: 100 }, () => generateId())
    expect(new Set(ids).size).toBe(100)
  })
})

describe('formatDuration', () => {
  it('formats 0 seconds as 00:00', () => {
    expect(formatDuration(0)).toBe('00:00')
  })

  it('formats 65 seconds as 01:05', () => {
    expect(formatDuration(65)).toBe('01:05')
  })

  it('formats 3661 seconds as 61:01', () => {
    expect(formatDuration(3661)).toBe('61:01')
  })
})

describe('formatDate', () => {
  it('formats a known timestamp correctly', () => {
    // 2025-05-27 10:30 in UTC+8
    const ts = new Date('2025-05-27T10:30:00+08:00').getTime()
    const result = formatDate(ts)
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
  })
})

describe('parseStageTag', () => {
  it('extracts nextStage from a valid tag', () => {
    const { cleanContent, nextStage } = parseStageTag(
      '回答内容<!--NEXT_STAGE: tech-qa-->'
    )
    expect(cleanContent).toBe('回答内容')
    expect(nextStage).toBe('tech-qa')
  })

  it('returns null nextStage when no tag present', () => {
    const { cleanContent, nextStage } = parseStageTag('普通回答没有标记')
    expect(cleanContent).toBe('普通回答没有标记')
    expect(nextStage).toBeNull()
  })

  it('handles tag with extra whitespace', () => {
    const { nextStage } = parseStageTag('text<!--NEXT_STAGE: behavioral  -->')
    expect(nextStage).toBe('behavioral')
  })
})

describe('averageScore', () => {
  it('calculates average correctly', () => {
    expect(averageScore({ a: 6, b: 8 })).toBe(7)
  })

  it('returns 0 for empty object', () => {
    expect(averageScore({})).toBe(0)
  })
})

describe('getStars', () => {
  it('returns 5 filled stars for score 10', () => {
    expect(getStars(10)).toBe('★★★★★')
  })

  it('returns 0 filled stars for score 0', () => {
    expect(getStars(0)).toBe('☆☆☆☆☆')
  })

  it('rounds correctly', () => {
    expect(getStars(7)).toBe('★★★★☆')
  })
})
