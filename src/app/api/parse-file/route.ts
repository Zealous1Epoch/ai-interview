import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return Response.json({ error: '未收到文件' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = file.name.toLowerCase()

    let text = ''

    if (fileName.endsWith('.pdf')) {
      const pdfParse = (await import('pdf-parse')).default
      const data = await pdfParse(buffer)
      text = data.text
    } else if (fileName.endsWith('.docx')) {
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
    } else if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
      text = buffer.toString('utf-8')
    } else {
      return Response.json({ error: '不支持的文件格式，请上传 PDF、DOCX、TXT 或 MD 文件' }, { status: 400 })
    }

    const cleaned = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()

    if (!cleaned) {
      return Response.json({ error: '未能从文件中提取到文字内容' }, { status: 400 })
    }

    return Response.json({ text: cleaned, fileName: file.name })
  } catch (e) {
    const message = e instanceof Error ? e.message : '未知错误'
    return Response.json({ error: `文件解析失败: ${message}` }, { status: 500 })
  }
}
