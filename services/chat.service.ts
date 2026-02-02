import { ref, push, set, get } from 'firebase/database'
import { database } from '@/lib/firebase'
import { Message } from '@/types/message.types'

export const ChatService = {
  async sendMessage(
    roomId: string,
    message: Omit<Message, 'id' | 'timestamp'>
  ): Promise<void> {
    const msgRef = push(ref(database, `rooms/${roomId}/messages`))

    await set(msgRef, {
      ...message,
      id: msgRef.key,
      timestamp: new Date().toISOString(),
    })
  },

  async getMessages(roomId: string): Promise<Message[]> {
    const snap = await get(ref(database, `rooms/${roomId}/messages`))
    if (!snap.exists()) return []

    return Object.values(snap.val()) as Message[]
  },
}
