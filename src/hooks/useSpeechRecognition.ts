'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface UseSpeechRecognitionReturn {
  isListening: boolean
  isSupported: boolean
  interimText: string
  startListening: () => void
  stopListening: () => Promise<string>
  error: string | null
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false)
  const [interimText, setInterimText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const finalTextRef = useRef('')
  const resolveRef = useRef<((text: string) => void) | null>(null)

  const isSupported = typeof window !== 'undefined' && (
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  )

  useEffect(() => {
    if (!isSupported) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'zh-CN'
    recognition.interimResults = true
    recognition.continuous = true
    recognition.maxAlternatives = 1

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          final += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }
      if (final) finalTextRef.current += final
      setInterimText(finalTextRef.current + interim)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'not-allowed') {
        setError('麦克风权限被拒绝，请在浏览器设置中允许访问麦克风')
      } else if (event.error !== 'aborted') {
        setError(`语音识别出错: ${event.error}`)
      }
      setIsListening(false)
      if (resolveRef.current) {
        resolveRef.current(finalTextRef.current)
        resolveRef.current = null
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      if (resolveRef.current) {
        resolveRef.current(finalTextRef.current)
        resolveRef.current = null
      }
    }

    recognitionRef.current = recognition

    return () => {
      recognition.abort()
    }
  }, [isSupported])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return
    setError(null)
    setInterimText('')
    finalTextRef.current = ''
    setIsListening(true)
    recognitionRef.current.start()
  }, [])

  const stopListening = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      if (!recognitionRef.current) {
        resolve(finalTextRef.current)
        return
      }
      resolveRef.current = resolve
      recognitionRef.current.stop()
    })
  }, [])

  return { isListening, isSupported, interimText, startListening, stopListening, error }
}
