'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useInterviewStore } from '@/store/interview'
import type { Direction } from '@/lib/types'

const DIRECTIONS: { value: Direction; label: string; desc: string }[] = [
  { value: 'technical', label: '技术面试', desc: '侧重八股文、算法和技术细节' },
  { value: 'general', label: '通用面试', desc: '侧重行为问题和综合素质' },
  { value: 'comprehensive', label: '综合面试', desc: '技术和通用问题兼顾' },
]

export default function SetupPage() {
  const router = useRouter()
  const setSetup = useInterviewStore((s) => s.setSetup)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [position, setPosition] = useState('')
  const [resume, setResume] = useState('')
  const [direction, setDirection] = useState<Direction>('comprehensive')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!position.trim()) e.position = '请填写目标岗位'
    if (!resume.trim()) e.resume = '请填写简历内容或上传简历文件'
    else if (resume.trim().length < 20) e.resume = '简历内容至少20个字'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleStart = () => {
    if (!validate()) return
    setSetup({ position: position.trim(), resume: resume.trim(), direction })
    router.push('/interview')
  }

  async function parseFile(file: File) {
    setIsUploading(true)
    setErrors({})
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/parse-file', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) { setErrors({ resume: data.error }); return }
      setResume(data.text)
      setUploadedFile(data.fileName)
    } catch {
      setErrors({ resume: '上传失败，请检查网络' })
    } finally { setIsUploading(false) }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg lg:max-w-2xl space-y-10">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <h1 className="font-serif text-3xl font-semibold text-zinc-900 tracking-tight">
            面试设置
          </h1>
          <p className="text-base leading-7 text-zinc-500 mt-2">
            AI 将根据你的背景进行个性化面试
          </p>
        </div>

        <div className="space-y-8">
          {/* Position */}
          <div className="animate-fade-in stagger-1">
            <label className="block text-sm font-medium text-zinc-700 mb-2">目标岗位</label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="如：软件工程师实习、前端开发校招"
              className="input-field"
            />
            {errors.position && <p className="text-red-500 text-xs mt-1.5">{errors.position}</p>}
          </div>

          {/* Resume */}
          <div className="animate-fade-in stagger-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-zinc-700">简历内容</label>
              <span className="text-xs text-zinc-400">支持 PDF / DOCX / TXT</span>
            </div>

            <div
              onDrop={(e) => {
                e.preventDefault(); setIsDragOver(false)
                const f = e.dataTransfer.files?.[0]; if (f) parseFile(f)
              }}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
              onDragLeave={() => setIsDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-200"
              style={{
                borderColor: isDragOver ? '#a1a1aa' : uploadedFile ? '#d4d4d8' : '#e4e4e7',
                background: isDragOver ? '#fafafa' : 'white',
              }}
            >
              <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt,.md" onChange={(e) => {
                const f = e.target.files?.[0]; if (f) parseFile(f)
                if (fileInputRef.current) fileInputRef.current.value = ''
              }} className="hidden" />
              {isUploading ? (
                <div className="flex items-center justify-center gap-2 text-sm text-zinc-400 py-2">
                  <div className="w-4 h-4 border-2 border-zinc-200 border-t-zinc-400 rounded-full animate-spin" />
                  正在解析...
                </div>
              ) : uploadedFile ? (
                <div className="text-sm py-2">
                  <span className="text-zinc-700 font-medium">已解析：{uploadedFile}</span>
                  <br /><span className="text-xs text-zinc-400">点击重新上传，或下方直接编辑</span>
                </div>
              ) : (
                <div className="text-sm text-zinc-400 py-2">
                  拖拽简历文件到此处，或点击上传
                </div>
              )}
            </div>

            <textarea
              value={resume}
              onChange={(e) => { setResume(e.target.value); if (e.target.value.trim() && uploadedFile) setUploadedFile(null) }}
              placeholder="粘贴或输入简历内容..."
              rows={8}
              className="input-field mt-2 resize-none leading-7"
            />
            {errors.resume && <p className="text-red-500 text-xs mt-1.5">{errors.resume}</p>}
          </div>

          {/* Direction */}
          <div className="animate-fade-in stagger-3">
            <label className="block text-sm font-medium text-zinc-700 mb-3">面试方向</label>
            <div className="grid grid-cols-3 gap-3">
              {DIRECTIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDirection(d.value)}
                  className="p-4 rounded-2xl border-2 text-center transition-all duration-200"
                  style={{
                    borderColor: direction === d.value ? '#18181b' : '#e4e4e7',
                    background: direction === d.value ? '#fafafa' : 'white',
                  }}
                >
                  <div className="font-serif text-lg font-semibold mb-1"
                    style={{ color: direction === d.value ? '#18181b' : '#a1a1aa' }}>
                    {d.label}
                  </div>
                  <div className="text-xs leading-relaxed text-zinc-400">{d.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleStart} className="btn-primary w-full py-4 text-base animate-fade-in stagger-4">
          开始面试
        </button>
      </div>
    </div>
  )
}
