import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Message, Stage, InterviewSetup } from '@/lib/types'
import { generateId } from '@/lib/utils'

interface InterviewState {
  setup: InterviewSetup | null
  stage: Stage
  messages: Message[]
  interviewId: string | null
  startTime: number | null
  isStreaming: boolean
  isEvaluating: boolean
  lastActivityTime: number

  setSetup: (setup: InterviewSetup) => void
  setStage: (stage: Stage) => void
  addMessage: (message: Message) => void
  appendToLastAiMessage: (chunk: string) => void
  setIsStreaming: (v: boolean) => void
  setIsEvaluating: (v: boolean) => void
  startInterview: () => string
  endInterview: () => void
  updateLastActivity: () => void
  reset: () => void
}

const initialState = {
  setup: null,
  stage: 'self-intro' as Stage,
  messages: [] as Message[],
  interviewId: null as string | null,
  startTime: null as number | null,
  isStreaming: false,
  isEvaluating: false,
  lastActivityTime: Date.now(),
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSetup: (setup) => set({ setup }),

      setStage: (stage) => set({ stage }),

      addMessage: (message) =>
        set((s) => ({ messages: [...s.messages, message], lastActivityTime: Date.now() })),

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
      setIsEvaluating: (isEvaluating) => set({ isEvaluating }),

      startInterview: () => {
        const id = generateId()
        set({
          interviewId: id,
          startTime: Date.now(),
          stage: 'self-intro',
          messages: [],
          lastActivityTime: Date.now(),
        })
        return id
      },

      endInterview: () => set({ stage: 'ended', isStreaming: false }),

      updateLastActivity: () => set({ lastActivityTime: Date.now() }),

      reset: () => set({ ...initialState, setup: get().setup }),
    }),
    {
      name: 'interview-state',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
