import { ref, set, remove, get } from 'firebase/database'
import { database } from '@/lib/firebase'
import { User } from '@/types/user.types'

export const UserService = {
  async addUser(
    roomId: string,
    user: User
  ): Promise<void> {
    await set(ref(database, `rooms/${roomId}/users/${user.id}`), user)
  },

  async removeUser(
    roomId: string,
    userId: string
  ): Promise<void> {
    await remove(ref(database, `rooms/${roomId}/users/${userId}`))
  },

  async getUsers(roomId: string): Promise<User[]> {
    const snap = await get(ref(database, `rooms/${roomId}/users`))
    if (!snap.exists()) return []

    return Object.values(snap.val()) as User[]
  },
}
