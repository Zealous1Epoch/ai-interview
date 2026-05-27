import { NextRequest } from 'next/server'

const API_KEY = process.env.DEEPSEEK_API_KEY || ''
const BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'

export async function POST(req: NextRequest) {
  try {
    const { messages, stream = true } = await req.json()

    if (!API_KEY || API_KEY === 'your_api_key_here') {
      return Response.json({ error: 'API Key 未配置，请在 .env.local 中设置 DEEPSEEK_API_KEY' }, { status: 500 })
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    const response = await fetch(`${BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        stream,
        temperature: 0.3,
        max_tokens: 1024,
        top_p: 0.9,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      const err = await response.text()
      return Response.json({ error: `AI API 错误: ${response.status} - ${err}` }, { status: response.status })
    }

    if (!stream) {
      const data = await response.json()
      return Response.json({ content: data.choices[0].message.content })
    }

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        const decoder = new TextDecoder()
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const text = decoder.decode(value, { stream: true })
            const lines = text.split('\n').filter((l) => l.startsWith('data: '))

            for (const line of lines) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                continue
              }
              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
                }
              } catch {
                // skip unparseable chunks
              }
            }
          }
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : 'Unknown error'
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`))
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    if (message.includes('abort')) {
      return Response.json({ error: 'AI 响应超时，请重试' }, { status: 504 })
    }
    return Response.json({ error: `服务器错误: ${message}` }, { status: 500 })
  }
}
