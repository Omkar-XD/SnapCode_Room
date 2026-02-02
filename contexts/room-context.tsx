'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import {
  ref,
  set,
  push,
  onValue,
  update,
  remove,
  get,
} from 'firebase/database'
import { database } from '@/lib/firebase'

/* =======================
   TYPES
======================= */

export interface User {
  id: string
  name: string
  color: string
  joinedAt: string
}

export interface Message {
  id: string
  userId: string
  userName?: string
  userColor?: string
  text?: string
  snippetId?: string
  snippetTitle?: string
  timestamp: string
}

export interface Snippet {
  id: string
  title: string
  language: string
  code: string
  description?: string
  createdAt: string
  createdBy: string
  createdById: string
}

export interface Room {
  id: string
  name: string
  adminId: string
  adminName: string
  password?: string | null   // ✅ FIX 1
  expiresAt: string
  createdAt: string
  users: User[]
  snippets: Snippet[]
  messages: Message[]
}

interface RoomContextType {
  currentUser: User | null
  room: Room | null
  isAdmin: boolean
  messages: Message[]
  selectedSnippetId: string | null

  createRoom: (
    roomName: string,
    adminName: string,
    expiryHours: number,
    password?: string
  ) => Promise<string>

  joinRoom: (
    roomId: string,
    userName: string,
    password?: string
  ) => Promise<boolean>

  addSnippet: (
    snippet: Omit<Snippet, 'id' | 'createdAt' | 'createdById'>
  ) => Promise<void>

  deleteSnippet: (snippetId: string) => Promise<void>
  editSnippet: (snippetId: string, updates: Partial<Snippet>) => Promise<void>
  addMessage: (text: string, snippetId?: string, snippetTitle?: string) => Promise<void>
  selectSnippet: (id: string | null) => void
  leaveRoom: () => Promise<void>
  deleteRoom: (roomId: string) => Promise<void>
  getRoomData: (roomId: string) => Promise<{ id: string; expiresAt: string; password?: string | null } | null>
}

/* =======================
   CONTEXT
======================= */

const RoomContext = createContext<RoomContextType | undefined>(undefined)

const COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
]

const uid = () => Math.random().toString(36).slice(2, 11)

/* =======================
   PROVIDER
======================= */

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [room, setRoom] = useState<Room | null>(null)
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(null)

  /* -------- realtime room sync -------- */
  useEffect(() => {
    if (!room?.id) return

    const roomRef = ref(database, `rooms/${room.id}`)

    return onValue(roomRef, snap => {
      if (!snap.exists()) {
        setRoom(null)
        return
      }

      const data = snap.val()

      setRoom({
        ...data,
        users: Object.values(data.users || {}) as User[],
        snippets: Object.values(data.snippets || {}) as Snippet[],
        messages: Object.values(data.messages || {}) as Message[],
      })
    })
  }, [room?.id])

  /* =======================
     ACTIONS
  ======================= */

  const createRoom = useCallback(async (
    roomName: string,
    adminName: string,
    expiryHours: number,
    password?: string
  ) => {
    const roomId = uid()
    const userId = uid()

    const user: User = {
      id: userId,
      name: adminName,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      joinedAt: new Date().toISOString(),
    }

    const roomData: Omit<Room, 'users' | 'snippets' | 'messages'> = {
      id: roomId,
      name: roomName,
      adminId: userId,
      adminName,
      password: password ?? null, // ✅ FIX 2
      createdAt: new Date().toISOString(),
      expiresAt: new Date(
        Date.now() + expiryHours * 60 * 60 * 1000
      ).toISOString(),
    }

    await set(ref(database, `rooms/${roomId}`), roomData)
    await set(ref(database, `rooms/${roomId}/users/${userId}`), user)

    setCurrentUser(user)
    setRoom({
      ...roomData,
      users: [user],
      snippets: [],
      messages: [],
    })

    return roomId
  }, [])

  const joinRoom = useCallback(async (
    roomId: string,
    userName: string,
    password?: string
  ) => {
    const roomSnap = await new Promise<any>(res =>
      onValue(ref(database, `rooms/${roomId}`), s => res(s), { onlyOnce: true })
    )

    if (!roomSnap.exists()) return false
    const data = roomSnap.val()
    if (data.password && data.password !== password) {
      return false
    }

    const userId = uid()
    const user: User = {
      id: userId,
      name: userName,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      joinedAt: new Date().toISOString(),
    }

    await set(ref(database, `rooms/${roomId}/users/${userId}`), user)

    setCurrentUser(user)
    // Set room so the Firebase listener starts
    setRoom({
      ...data,
      users: Object.values(data.users || {}) as User[],
      snippets: Object.values(data.snippets || {}) as Snippet[],
      messages: Object.values(data.messages || {}) as Message[],
    })
    return true
  }, [])

  const addSnippet = useCallback(async (
    snippet: Omit<Snippet, 'id' | 'createdAt' | 'createdById'>
  ) => {
    if (!room || !currentUser) return

    const snippetRef = push(ref(database, `rooms/${room.id}/snippets`))
    const payload = {
      id: snippetRef.key,
      title: snippet.title,
      language: snippet.language,
      code: snippet.code,
      description: snippet.description ?? '',
      createdAt: new Date().toISOString(),
      createdBy: currentUser.name,
      createdById: currentUser.id,
    }
    await set(snippetRef, payload)
  }, [room, currentUser])

  const deleteSnippet = useCallback(async (snippetId: string) => {
    if (!room) return
    await remove(ref(database, `rooms/${room.id}/snippets/${snippetId}`))
  }, [room])

  const editSnippet = useCallback(async (
    snippetId: string,
    updates: Partial<Snippet>
  ) => {
    if (!room) return
    const sanitized = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    ) as Partial<Snippet>
    if (Object.keys(sanitized).length === 0) return
    await update(
      ref(database, `rooms/${room.id}/snippets/${snippetId}`),
      sanitized
    )
  }, [room])

  const addMessage = useCallback(async (
    text: string,
    snippetId?: string,
    snippetTitle?: string
  ) => {
    if (!room || !currentUser) return

    const msgRef = push(ref(database, `rooms/${room.id}/messages`))
    const payload: Record<string, unknown> = {
      id: msgRef.key,
      userId: currentUser.id,
      userName: currentUser.name,
      userColor: currentUser.color,
      text,
      timestamp: new Date().toISOString(),
    }
    if (snippetId != null) payload.snippetId = snippetId
    if (snippetTitle != null) payload.snippetTitle = snippetTitle
    await set(msgRef, payload)
  }, [room, currentUser])

  const leaveRoom = useCallback(async () => {
    if (!room || !currentUser) return
    await remove(ref(database, `rooms/${room.id}/users/${currentUser.id}`))
    setCurrentUser(null)
    setRoom(null)
    setSelectedSnippetId(null)
  }, [room, currentUser])

  const deleteRoom = useCallback(async (roomId: string) => {
    await remove(ref(database, `rooms/${roomId}`))
    setCurrentUser(null)
    setRoom(null)
    setSelectedSnippetId(null)
  }, [])

  const getRoomData = useCallback(async (roomId: string) => {
    const snap = await get(ref(database, `rooms/${roomId}`))
    if (!snap.exists()) return null
    const data = snap.val()
    return {
      id: data.id,
      expiresAt: data.expiresAt,
      password: data.password ?? null,
    }
  }, [])

  return (
    <RoomContext.Provider
      value={{
        currentUser,
        room,
        isAdmin: room?.adminId === currentUser?.id,
        messages: room?.messages || [],
        selectedSnippetId,
        createRoom,
        joinRoom,
        addSnippet,
        deleteSnippet,
        editSnippet,
        addMessage,
        selectSnippet: setSelectedSnippetId,
        leaveRoom,
        deleteRoom,
        getRoomData,
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}

/* =======================
   HOOK
======================= */

export function useRoom() {
  const ctx = useContext(RoomContext)
  if (!ctx) throw new Error('useRoom must be used within RoomProvider')
  return ctx
}
