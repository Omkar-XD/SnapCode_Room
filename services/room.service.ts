import { ref, set, get, remove } from 'firebase/database'
import { database } from '@/lib/firebase'
import { Room } from '@/types/room.types'
import { User } from '@/types/user.types'

const uid = () => Math.random().toString(36).slice(2, 11)

export const RoomService = {
  async createRoom(
    roomName: string,
    adminName: string,
    expiryHours: number,
    password?: string
  ): Promise<{ roomId: string; user: User }> {
    const roomId = uid()
    const adminId = uid()

    const adminUser: User = {
      id: adminId,
      name: adminName,
      color: '#4ECDC4',
      joinedAt: new Date().toISOString(),
    }

    const roomData: Omit<Room, 'users' | 'snippets' | 'messages'> = {
      id: roomId,
      name: roomName,
      adminId,
      adminName,
      password: password || null,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(
        Date.now() + expiryHours * 60 * 60 * 1000
      ).toISOString(),
    }

    await set(ref(database, `rooms/${roomId}`), roomData)
    await set(ref(database, `rooms/${roomId}/users/${adminId}`), adminUser)

    return { roomId, user: adminUser }
  },

  async getRoom(roomId: string): Promise<Room | null> {
    const snap = await get(ref(database, `rooms/${roomId}`))
    if (!snap.exists()) return null

    const data = snap.val()

    return {
      ...data,
      users: Object.values(data.users || {}),
      snippets: Object.values(data.snippets || {}),
      messages: Object.values(data.messages || {}),
    }
  },

  async joinRoom(
    roomId: string,
    userName: string,
    password?: string
  ): Promise<User | null> {
    const roomSnap = await get(ref(database, `rooms/${roomId}`))
    if (!roomSnap.exists()) return null

    const room = roomSnap.val()
    if (room.password && room.password !== password) return null

    const userId = uid()
    const user: User = {
      id: userId,
      name: userName,
      color: '#45B7D1',
      joinedAt: new Date().toISOString(),
    }

    await set(ref(database, `rooms/${roomId}/users/${userId}`), user)
    return user
  },

  async leaveRoom(roomId: string, userId: string): Promise<void> {
    await remove(ref(database, `rooms/${roomId}/users/${userId}`))
  },
}
