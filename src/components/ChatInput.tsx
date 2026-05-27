'use client'

import { useState, useEffect } from 'react'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'

interface Props {
  onSend: (text: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('')
  const { isListening, isSupported, interimText, startListening, stopListening, error } =
    useSpeechRecognition()

  useEffect(() => {
    if (interimText) setText(interimText)
  }, [interimText])

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleMic = async () => {
    if (isListening) { await stopListening() } else { startListening() }
  }

  return (
    <div>
      {error && (
        <div className="px-4 py-2 text-xs text-center bg-zinc-100 text-zinc-500">{error}</div>
      )}

      <div className="flex gap-3 items-end p-4 bg-white border-t border-zinc-200">
        {isSupported && (
          <button
            onClick={handleMic}
            disabled={disabled}
            type="button"
            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              isListening
                ? 'bg-zinc-900 text-white'
                : 'bg-white border border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isListening ? '停止' : '语音输入'}
          >
            {isListening ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="9" y="1" width="6" height="12" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0" />
              </svg>
            )}
          </button>
        )}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? '正在聆听...' : '输入你的回答...'}
          rows={2}
          disabled={disabled}
          className="flex-1 resize-none rounded-2xl px-4 py-3 text-sm bg-zinc-50 border border-zinc-200
                     text-zinc-800 outline-none transition-all duration-200
                     focus:border-zinc-400 focus:bg-white
                     disabled:opacity-50 placeholder:text-zinc-400"
        />

        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: text.trim() && !disabled ? '#18181b' : '#f4f4f5',
            color: text.trim() && !disabled ? 'white' : '#a1a1aa',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
