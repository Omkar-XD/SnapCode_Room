import { User } from './user.types'
import { Snippet } from './snippet.types'
import { Message } from './message.types'

export interface Room {
  id: string
  name: string
  adminId: string
  adminName: string
  password?: string | null
  createdAt: string
  expiresAt: string

  users: User[]
  snippets: Snippet[]
  messages: Message[]
}
