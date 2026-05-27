export type Direction = 'technical' | 'general' | 'comprehensive'

export type Stage =
  | 'self-intro'
  | 'project-deep'
  | 'tech-qa'
  | 'behavioral'
  | 'reverse-qa'
  | 'ended'

export interface Message {
  id: string
  role: 'ai' | 'user'
  content: string
  timestamp: number
}

export interface Interview {
  id: string
  createdAt: number
  position: string
  direction: Direction
  resume: string
  messages: Message[]
  duration: number
  stage: Stage
}

export interface Scores {
  technical: number
  communication: number
  logic: number
  project: number
}

export type PracticeType =
  | 'networking'
  | 'os'
  | 'database'
  | 'language'
  | 'behavioral'
  | 'project-deep'

export interface Improvement {
  content: string
  practiceType: PracticeType
}

export interface Report {
  id: string
  interviewId: string
  scores: Scores
  summary: string
  strengths: string[]
  improvements: Improvement[]
}

export interface InterviewSetup {
  position: string
  resume: string
  direction: Direction
}

export const STAGE_LABELS: Record<Stage, string> = {
  'self-intro': '自我介绍',
  'project-deep': '项目深挖',
  'tech-qa': '技术问答',
  'behavioral': '行为问题',
  'reverse-qa': '反问环节',
  'ended': '已结束',
}

export const DIRECTION_LABELS: Record<Direction, string> = {
  technical: '技术面试',
  general: '通用面试',
  comprehensive: '综合面试',
}

export const PRACTICE_LABELS: Record<PracticeType, string> = {
  networking: '计算机网络',
  os: '操作系统',
  database: '数据库',
  language: '编程语言',
  behavioral: '行为问题',
  'project-deep': '项目深挖',
}

export const SCORE_LABELS: Record<keyof Scores, string> = {
  technical: '技术能力',
  communication: '沟通表达',
  logic: '逻辑思维',
  project: '项目经验',
}
