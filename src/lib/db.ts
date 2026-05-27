import { openDB, IDBPDatabase } from 'idb'
import type { Interview, Report } from './types'

const DB_NAME = 'ai-interview-simulator'
const DB_VERSION = 1

function getDb(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('interviews')) {
        const store = db.createObjectStore('interviews', { keyPath: 'id' })
        store.createIndex('createdAt', 'createdAt')
      }
      if (!db.objectStoreNames.contains('reports')) {
        const store = db.createObjectStore('reports', { keyPath: 'id' })
        store.createIndex('interviewId', 'interviewId')
      }
    },
  })
}

export async function saveInterview(interview: Interview): Promise<void> {
  const db = await getDb()
  await db.put('interviews', interview)
}

export async function getInterview(id: string): Promise<Interview | undefined> {
  const db = await getDb()
  return db.get('interviews', id)
}

export async function getAllInterviews(): Promise<Interview[]> {
  const db = await getDb()
  return db.getAllFromIndex('interviews', 'createdAt')
}

export async function deleteInterview(id: string): Promise<void> {
  const db = await getDb()
  await db.delete('interviews', id)
  await db.delete('reports', id)
}

export async function saveReport(report: Report): Promise<void> {
  const db = await getDb()
  await db.put('reports', report)
}

export async function getReport(id: string): Promise<Report | undefined> {
  const db = await getDb()
  return db.get('reports', id)
}

export async function getReportByInterviewId(interviewId: string): Promise<Report | undefined> {
  const db = await getDb()
  return db.getFromIndex('reports', 'interviewId', interviewId)
}
