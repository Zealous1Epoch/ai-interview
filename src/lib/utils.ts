export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function formatDate(timestamp: number): string {
  const d = new Date(timestamp)
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  const hour = d.getHours().toString().padStart(2, '0')
  const minute = d.getMinutes().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

export function parseStageTag(content: string): { cleanContent: string; nextStage: string | null } {
  const match = content.match(/<!--NEXT_STAGE:\s*(\S+)\s*-->/)
  if (match) {
    return {
      cleanContent: content.replace(/<!--NEXT_STAGE:.*?-->/, '').trim(),
      nextStage: match[1],
    }
  }
  return { cleanContent: content, nextStage: null }
}

export function averageScore(scores: Record<string, number>): number {
  const values = Object.values(scores)
  if (values.length === 0) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}

export function getStars(score: number): string {
  const stars = Math.round(score / 2)
  return '★'.repeat(stars) + '☆'.repeat(5 - stars)
}
