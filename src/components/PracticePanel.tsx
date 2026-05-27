'use client'

import { useRef, useEffect, useCallback } from 'react'
import { usePracticeStore } from '@/store/practice'
import { buildPracticePrompt } from '@/lib/prompts'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { PRACTICE_LABELS } from '@/lib/types'
import type { PracticeType } from '@/lib/types'

interface Props {
  practiceType: PracticeType
  onBack: () => void
}

export default function PracticePanel({ practiceType, onBack }: Props) {
  const store = usePracticeStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    store.reset()
    store.setPracticeType(practiceType)
    initPractice()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practiceType])

  useEffect(() => {
    scrollToBottom()
  }, [store.messages, scrollToBottom])

  async function initPractice() {
    store.setIsStreaming(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: buildPracticePrompt(practiceType) },
            { role: 'user', content: '请出第一道题' },
          ],
          stream: true,
        }),
      })
      if (!response.ok) { store.setIsStreaming(false); return }
      const reader = response.body?.getReader()
      if (!reader) { store.setIsStreaming(false); return }
      store.addMessage({ role: 'ai', content: '' })
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        const lines = text.split('\n').filter((l) => l.startsWith('data: '))
        for (const line of lines) {
          if (line.slice(6) === '[DONE]') continue
          try { const p = JSON.parse(line.slice(6)); if (p.content) store.appendToLastAiMessage(p.content) } catch { /* skip */ }
        }
      }
    } catch { /* ignore */ }
    store.setIsStreaming(false)
  }

  async function handleSend(text: string) {
    store.addMessage({ role: 'user', content: text })
    store.setCurrentQuestion(store.currentQuestion + 1)

    if (store.currentQuestion + 1 >= store.questionCount) {
      store.addMessage({ role: 'ai', content: '练习已结束！你可以返回报告页面，或者继续提问。' })
      return
    }

    store.setIsStreaming(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: buildPracticePrompt(practiceType) },
            ...store.messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: text },
          ],
          stream: true,
        }),
      })
      if (!response.ok) { store.setIsStreaming(false); return }
      const reader = response.body?.getReader()
      if (!reader) { store.setIsStreaming(false); return }
      store.addMessage({ role: 'ai', content: '' })
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        const lines = text.split('\n').filter((l) => l.startsWith('data: '))
        for (const line of lines) {
          if (line.slice(6) === '[DONE]') continue
          try { const p = JSON.parse(line.slice(6)); if (p.content) store.appendToLastAiMessage(p.content) } catch { /* skip */ }
        }
      }
    } catch { /* ignore */ }
    store.setIsStreaming(false)
  }

  const progress = Math.min(store.currentQuestion, store.questionCount)

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={onBack} className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors font-medium">
            ← 返回报告
          </button>
          <div className="text-center flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-800">
              {PRACTICE_LABELS[practiceType]} 专项练习
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500">
              {progress}/{store.questionCount}
            </span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {store.messages.map((m, i) => (
          <ChatMessage
            key={i}
            role={m.role}
            content={m.content}
            isStreaming={store.isStreaming && i === store.messages.length - 1 && m.role === 'ai'}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {progress < store.questionCount && (
        <ChatInput onSend={handleSend} disabled={store.isStreaming} />
      )}
      {progress >= store.questionCount && (
        <div className="p-4 text-center bg-white border-t border-zinc-200">
          <button onClick={onBack} className="btn-primary text-sm">
            返回报告
          </button>
        </div>
      )}
    </div>
  )
}
