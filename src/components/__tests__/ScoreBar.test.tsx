import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScoreBar from '../ScoreBar'

describe('ScoreBar', () => {
  it('renders label and score', () => {
    render(<ScoreBar label="技术能力" score={8} />)
    expect(screen.getByText('技术能力')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('/10')).toBeInTheDocument()
  })

  it('renders progress bar at correct width', () => {
    const { container } = render(<ScoreBar label="沟通表达" score={5} />)
    const bar = container.querySelector('.bg-zinc-800')
    expect(bar).toHaveStyle({ width: '50%' })
  })

  it('renders score 0 correctly', () => {
    render(<ScoreBar label="逻辑思维" score={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
