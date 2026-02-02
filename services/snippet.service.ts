import { ref, push, set, update, remove, get } from 'firebase/database'
import { database } from '@/lib/firebase'
import { Snippet } from '@/types/snippet.types'

export const SnippetService = {
  async addSnippet(
    roomId: string,
    snippet: Omit<Snippet, 'id' | 'createdAt'>
  ): Promise<void> {
    const snippetRef = push(ref(database, `rooms/${roomId}/snippets`))

    await set(snippetRef, {
      ...snippet,
      id: snippetRef.key,
      createdAt: new Date().toISOString(),
    })
  },

  async updateSnippet(
    roomId: string,
    snippetId: string,
    updates: Partial<Snippet>
  ): Promise<void> {
    await update(
      ref(database, `rooms/${roomId}/snippets/${snippetId}`),
      updates
    )
  },

  async deleteSnippet(roomId: string, snippetId: string): Promise<void> {
    await remove(ref(database, `rooms/${roomId}/snippets/${snippetId}`))
  },

  async getSnippets(roomId: string): Promise<Snippet[]> {
    const snap = await get(ref(database, `rooms/${roomId}/snippets`))
    if (!snap.exists()) return []

    return Object.values(snap.val()) as Snippet[]
  },
}
