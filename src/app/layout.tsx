import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import ErrorBoundary from '@/components/ErrorBoundary'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'AI 面试模拟器',
  description: '面向在校生的 AI 面试练习工具，支持全真模拟面试、评估报告、专项练习',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${playfair.variable} min-h-screen antialiased`}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  )
}
