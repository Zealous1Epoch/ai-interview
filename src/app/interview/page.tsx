'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useInterviewStore } from '@/store/interview'
import { buildInterviewSystemPrompt, buildInterviewContext, EVALUATION_PROMPT } from '@/lib/prompts'
import { saveInterview, saveReport } from '@/lib/db'
import { generateId, parseStageTag } from '@/lib/utils'
import ChatMessage from '@/components/ChatMessage'
import ChatInput from '@/components/ChatInput'
import InterviewHeader from '@/components/InterviewHeader'
import InactivityPrompt from '@/components/InactivityPrompt'
import type { Report, Stage } from '@/lib/types'

export default function InterviewPage() {
  const router = useRouter()
  const store = useInterviewStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState('')
  const [showInactive, setShowInactive] = useState(false)
  const [duration, setDuration] = useState(0)
  const [shortAnswerWarned, setShortAnswerWarned] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const inactivityTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const durationTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (!store.setup) {
      router.replace('/setup')
      return
    }
    startInterview()
    return () => {
      if (inactivityTimer.current) clearInterval(inactivityTimer.current)
      if (durationTimer.current) clearInterval(durationTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [store.messages, scrollToBottom])

  function startInterview() {
    store.reset()
    const id = generateId()
    useInterviewStore.setState({ interviewId: id, startTime: Date.now(), stage: 'self-intro' })
    initInactivityTimer()
    startDurationTimer()
    sendInitialMessage()
  }

  function initInactivityTimer() {
    if (inactivityTimer.current) clearInterval(inactivityTimer.current)
    inactivityTimer.current = setInterval(() => {
      const elapsed = Date.now() - useInterviewStore.getState().lastActivityTime
      if (elapsed > 5 * 60 * 1000) {
        setShowInactive(true)
      }
    }, 30000)
  }

  function startDurationTimer() {
    if (durationTimer.current) clearInterval(durationTimer.current)
    durationTimer.current = setInterval(() => {
      const start = useInterviewStore.getState().startTime
      if (start) setDuration(Math.floor((Date.now() - start) / 1000))
    }, 1000)
  }

  function buildFullSystemPrompt(stage: Stage): string {
    const state = useInterviewStore.getState()
    if (!state.setup) return buildInterviewSystemPrompt(stage)

    const historyText = useInterviewStore.getState().messages
      .slice(-20)
      .map((m) => `${m.role === 'ai' ? '面试官' : '候选人'}: ${m.content}`)
      .join('\n')

    const context = buildInterviewContext(
      state.setup.position,
      state.setup.direction,
      state.setup.resume,
      historyText
    )

    return `${buildInterviewSystemPrompt(stage)}\n\n${context}`
  }

  async function sendInitialMessage() {
    const state = useInterviewStore.getState()
    if (!state.setup) return

    store.setIsStreaming(true)

    try {
      await streamChat([
        { role: 'system', content: buildFullSystemPrompt('self-intro') },
        { role: 'user', content: '面试开始，请向候选人打招呼并引导他做自我介绍。' },
      ])
    } catch {
      setError('AI 连接失败，请检查 API Key 配置')
    }
    store.setIsStreaming(false)
  }

  async function streamChat(messages: { role: string; content: string }[]) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, stream: true }),
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error || '请求失败')
    }

    const aiMsgId = generateId()
    store.addMessage({ id: aiMsgId, role: 'ai', content: '', timestamp: Date.now() })

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No reader')

    const decoder = new TextDecoder()
    let fullContent = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const text = decoder.decode(value, { stream: true })
      const lines = text.split('\n').filter((l) => l.startsWith('data: '))

      for (const line of lines) {
        const data = line.slice(6)
        if (data === '[DONE]') continue
        try {
          const parsed = JSON.parse(data)
          if (parsed.error) throw new Error(parsed.error)
          if (parsed.content) {
            fullContent += parsed.content
            store.appendToLastAiMessage(parsed.content)
          }
        } catch (e) {
          if ((e as Error).message !== 'skip') throw e
        }
      }
    }

    const { cleanContent, nextStage } = parseStageTag(fullContent)
    if (cleanContent !== fullContent) {
      const msgs = useInterviewStore.getState().messages
      const lastIdx = msgs.length - 1
      if (lastIdx >= 0 && msgs[lastIdx].role === 'ai') {
        msgs[lastIdx] = { ...msgs[lastIdx], content: cleanContent }
        useInterviewStore.setState({ messages: [...msgs] })
      }
    }

    if (nextStage) {
      const validStages: Stage[] = ['self-intro', 'project-deep', 'tech-qa', 'behavioral', 'reverse-qa', 'ended']
      if (validStages.includes(nextStage as Stage)) {
        store.setStage(nextStage as Stage)
      }
    }

    await persistToDb()
  }

  async function handleSend(text: string) {
    store.updateLastActivity()
    setShowInactive(false)
    setError('')

    if (text.trim().length < 10 && !shortAnswerWarned) {
      setShortAnswerWarned(true)
      setTimeout(() => setShortAnswerWarned(false), 30000)
    }

    const state = useInterviewStore.getState()

    store.addMessage({ id: generateId(), role: 'user', content: text, timestamp: Date.now() })

    if (state.stage === 'ended') return

    store.setIsStreaming(true)

    try {
      await streamChat([
        { role: 'system', content: buildFullSystemPrompt(state.stage) },
        { role: 'user', content: text },
      ])
    } catch (e) {
      setError((e as Error).message || 'AI 请求失败')
    }
    store.setIsStreaming(false)

    if (useInterviewStore.getState().stage === 'ended') {
      await generateReport()
    }
  }

  async function persistToDb() {
    const state = useInterviewStore.getState()
    if (!state.interviewId || !state.setup) return

    await saveInterview({
      id: state.interviewId,
      createdAt: state.startTime || Date.now(),
      position: state.setup.position,
      direction: state.setup.direction,
      resume: state.setup.resume,
      messages: state.messages,
      duration: Math.floor((Date.now() - (state.startTime || Date.now())) / 1000),
      stage: state.stage,
    })
  }

  async function generateReport() {
    store.setIsEvaluating(true)
    const state = useInterviewStore.getState()
    if (!state.interviewId) return

    const dialogText = state.messages
      .map((m) => `${m.role === 'ai' ? '面试官' : '候选人'}: ${m.content}`)
      .join('\n')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: EVALUATION_PROMPT },
            { role: 'user', content: `请评估以下面试对话：\n\n${dialogText}` },
          ],
          stream: false,
        }),
      })

      if (!response.ok) throw new Error('评估请求失败')

      const data = await response.json()
      let reportData: Omit<Report, 'id' | 'interviewId'>

      try {
        const clean = data.content
          .replace(/```json\s*/gi, '')
          .replace(/```\s*/gi, '')
          .trim()
        reportData = JSON.parse(clean)
      } catch {
        reportData = {
          scores: { technical: 6, communication: 6, logic: 6, project: 6 },
          summary: '评估生成失败，请重试',
          strengths: [],
          improvements: [],
        }
      }

      const report: Report = {
        id: state.interviewId,
        interviewId: state.interviewId,
        ...reportData,
      }

      await saveReport(report)
      await persistToDb()
      router.push(`/report/${state.interviewId}`)
    } catch {
      setError('评估报告生成失败，请重试')
    }
    store.setIsEvaluating(false)
  }

  function handleExit() {
    useInterviewStore.setState({ stage: 'ended' })
    persistToDb().then(() => {
      generateReport()
    })
  }

  if (!store.setup) return null

  return (
    <div className="h-screen flex flex-col bg-zinc-50">
      <InterviewHeader
        position={store.setup.position}
        direction={store.setup.direction}
        stage={store.stage}
        onExit={handleExit}
        duration={duration}
      />

      {/* Status banners */}
      <div className="px-4 space-y-2 pt-2">
        {isOffline && (
          <div className="p-2.5 text-xs text-center rounded-full bg-zinc-100 text-zinc-500 animate-fade-in">
            网络已断开，对话内容已保存在本地
          </div>
        )}
        {error && (
          <div className="p-2.5 text-xs text-center rounded-full bg-zinc-100 text-zinc-500 animate-fade-in flex items-center justify-center gap-2">
            {error}
            <button onClick={() => handleSend('')} className="underline font-medium text-zinc-700">重试</button>
          </div>
        )}
        {shortAnswerWarned && (
          <div className="p-2.5 text-xs text-center rounded-full bg-zinc-100 text-zinc-500 animate-fade-in">
            你的回答比较简短，可以多说一些细节哦
          </div>
        )}
        {store.isEvaluating && (
          <div className="p-2.5 text-xs text-center rounded-full bg-zinc-100 text-zinc-500 animate-fade-in flex items-center justify-center gap-2">
            <div className="w-3 h-3 border-2 border-zinc-200 border-t-zinc-400 rounded-full animate-spin" />
            正在生成评估报告...
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {store.messages.map((m) => (
          <ChatMessage
            key={m.id}
            role={m.role}
            content={m.content}
            isStreaming={
              store.isStreaming &&
              m.id === store.messages[store.messages.length - 1]?.id &&
              m.role === 'ai'
            }
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {store.stage !== 'ended' ? (
        <ChatInput onSend={handleSend} disabled={store.isStreaming || store.isEvaluating} />
      ) : (
        <div className="p-6 text-center bg-white border-t border-zinc-200">
          <p className="text-sm text-zinc-400">面试已结束</p>
        </div>
      )}

      {showInactive && (
        <InactivityPrompt onDismiss={() => {
          setShowInactive(false)
          store.updateLastActivity()
        }} />
      )}
    </div>
  )
}
