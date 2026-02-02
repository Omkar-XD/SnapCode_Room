import { NextResponse } from 'next/server'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'

/**
 * This API route is triggered by Vercel Cron.
 * It permanently deletes expired rooms and ALL related data.
 * No backups. No history. Hard delete only.
 */

let db: ReturnType<typeof getDatabase> | null = null

function getDb() {
  if (!db) {
    const adminApp =
      getApps().length === 0
        ? initializeApp({
            credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!)),
            databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
          })
        : getApps()[0]
    db = getDatabase(adminApp)
  }
  return db
}

export async function GET() {
  const now = new Date().toISOString()
  const roomsRef = getDb().ref('rooms')
  const snapshot = await roomsRef.get()

  if (!snapshot.exists()) {
    return NextResponse.json({ deletedRooms: 0 })
  }

  const rooms = snapshot.val()
  let deletedRooms = 0
  const updates: Record<string, null> = {}

  for (const roomId of Object.keys(rooms)) {
    const room = rooms[roomId]
    if (room.expiresAt && room.expiresAt <= now) {
      updates[`rooms/${roomId}`] = null
      deletedRooms++
    }
  }

  if (deletedRooms > 0) {
    await getDb().ref().update(updates)
  }

  return NextResponse.json({
    deletedRooms,
    status: 'cleanup completed',
  })
}
