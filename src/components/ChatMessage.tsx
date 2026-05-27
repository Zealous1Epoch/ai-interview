'use client'

interface Props {
  role: 'ai' | 'user'
  content: string
  isStreaming?: boolean
}

export default function ChatMessage({ role, content, isStreaming }: Props) {
  const isAi = role === 'ai'

  return (
    <div
      className={`flex ${isAi ? 'justify-start' : 'justify-end'} animate-fade-in`}
    >
      <div className={`max-w-[82%] px-5 py-3.5 text-sm leading-7 ${
        isAi
          ? 'bg-white border border-zinc-200 rounded-3xl rounded-tl-lg'
          : 'bg-zinc-100 rounded-3xl rounded-tr-lg text-zinc-800'
      }`}>
        {content}
        {isStreaming && <span className="cursor-blink" />}
      </div>
    </div>
  )
}
