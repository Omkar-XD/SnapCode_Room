'use client'

import { useEffect, useRef } from 'react'
import { ref, onValue } from 'firebase/database'
import { database } from '@/lib/firebase'
import { useToast } from '@/hooks/use-toast'
import { User } from '@/contexts/room-context'

interface UseRoomNotificationsProps {
  roomId: string
  currentUserId: string | null
  adminId: string | null
  users: User[]
}

export function useRoomNotifications({
  roomId,
  currentUserId,
  adminId,
}: UseRoomNotificationsProps) {
  const { toast } = useToast()
  const prevUsersMap = useRef<Map<string, string>>(new Map())
  const initialized = useRef(false)

  /* ---------- realtime join / leave detection ---------- */
  useEffect(() => {
    if (!roomId) return

    const usersRef = ref(database, `rooms/${roomId}/users`)

    return onValue(usersRef, snap => {
      if (!snap.exists()) {
        prevUsersMap.current.clear()
        return
      }

      const currentUsers = Object.values(snap.val()) as User[]
      const currentUsersMap = new Map(currentUsers.map(u => [u.id, u.name]))

      // Skip notifications on initial load
      if (!initialized.current) {
        prevUsersMap.current = currentUsersMap
        initialized.current = true
        return
      }

      // JOINED - show notification for new users (not self)
      currentUsers.forEach(user => {
        if (
          !prevUsersMap.current.has(user.id) &&
          user.id !== currentUserId
        ) {
          toast({
            title: `${user.name} joined`,
            description: 'A new collaborator has entered the room',
            duration: 4000,
          })
        }
      })

      // LEFT - show notification with username (or "Admin left the room")
      prevUsersMap.current.forEach((userName, prevId) => {
        if (!currentUsersMap.has(prevId) && prevId !== currentUserId) {
          const wasAdmin = prevId === adminId
          toast({
            title: wasAdmin ? 'Admin left the room' : `${userName} left`,
            description: wasAdmin
              ? 'The room admin has left the collaboration'
              : 'A collaborator has left the room',
            duration: 4000,
          })
        }
      })

      prevUsersMap.current = currentUsersMap
    })
  }, [roomId, currentUserId, adminId, toast])
}
