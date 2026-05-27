import { create } from 'zustand'
import type { PracticeType } from '@/lib/types'

interface PracticeState {
  practiceType: PracticeType | null
  questionCount: number
  currentQuestion: number
  messages: { role: 'ai' | 'user'; content: string }[]
  isStreaming: boolean

  setPracticeType: (t: PracticeType) => void
  setQuestionCount: (n: number) => void
  setCurrentQuestion: (n: number) => void
  addMessage: (m: { role: 'ai' | 'user'; content: string }) => void
  appendToLastAiMessage: (chunk: string) => void
  setIsStreaming: (v: boolean) => void
  reset: () => void
}

export const usePracticeStore = create<PracticeState>((set) => ({
  practiceType: null,
  questionCount: 5,
  currentQuestion: 0,
  messages: [],
  isStreaming: false,

  setPracticeType: (practiceType) => set({ practiceType }),
  setQuestionCount: (questionCount) => set({ questionCount }),
  setCurrentQuestion: (currentQuestion) => set({ currentQuestion }),
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  appendToLastAiMessage: (chunk) =>
    set((s) => {
      const msgs = [...s.messages]
      const last = msgs[msgs.length - 1]
      if (last && last.role === 'ai') {
        msgs[msgs.length - 1] = { ...last, content: last.content + chunk }
      }
      return { messages: msgs }
    }),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  reset: () =>
    set({
      practiceType: null,
      questionCount: 5,
      currentQuestion: 0,
      messages: [],
      isStreaming: false,
    }),
}))
