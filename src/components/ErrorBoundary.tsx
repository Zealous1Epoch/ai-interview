'use client'

import { Component } from 'react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-zinc-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" className="text-zinc-400">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <p className="text-sm text-zinc-500 mb-4">页面出现了意外错误</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-primary text-sm"
            >
              重试
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
