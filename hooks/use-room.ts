'use client'

import { useEffect, useState, useCallback } from 'react'
import { ref, onValue, push, set, remove } from 'firebase/database'
import { database } from '@/lib/firebase'

interface Room {
  id: string
  createdAt: string
  expiresAt: string
  isAdmin?: boolean
}

interface Snippet {
  id: string
  title: string
  language: string
  code: string
  description?: string
  createdAt: string
  createdBy: string
}

export const useRoom = (roomId: string) => {
  const [room, setRoom] = useState<Room | null>(null)
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)

  /* ---------- realtime room + snippets ---------- */
  useEffect(() => {
    if (!roomId) return

    const roomRef = ref(database, `rooms/${roomId}`)
    const snippetsRef = ref(database, `rooms/${roomId}/snippets`)

    const unsubRoom = onValue(roomRef, snap => {
      if (!snap.exists()) {
        setRoom(null)
        setLoading(false)
        return
      }

      const data = snap.val()
      setRoom({
        id: data.id,
        createdAt: data.createdAt,
        expiresAt: data.expiresAt,
        isAdmin: false,
      })
      setLoading(false)
    })

    const unsubSnippets = onValue(snippetsRef, snap => {
      if (!snap.exists()) {
        setSnippets([])
        return
      }

      const list = Object.values(snap.val()) as Snippet[]
      setSnippets(list.reverse())
    })

    return () => {
      unsubRoom()
      unsubSnippets()
    }
  }, [roomId])

  /* ---------- actions ---------- */

  const addSnippet = useCallback(async (snippetData: {
    title: string
    language: string
    code: string
    description?: string
  }) => {
    const refSnip = push(ref(database, `rooms/${roomId}/snippets`))

    await set(refSnip, {
      id: refSnip.key,
      ...snippetData,
      createdAt: new Date().toISOString(),
      createdBy: 'You',
    })
  }, [roomId])

  const deleteSnippet = useCallback(async (id: string) => {
    await remove(ref(database, `rooms/${roomId}/snippets/${id}`))
  }, [roomId])

  return {
    room,
    snippets,
    loading,
    addSnippet,
    deleteSnippet,
  }
}
