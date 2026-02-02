'use client'

import React from "react"

import { useState, useRef, useEffect } from 'react'
import { Message } from '@/contexts/room-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Send } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ChatPanelProps {
  messages: Message[]
  selectedSnippetId: string | null
  snippetTitle?: string
  onSendMessage: (text: string, snippetId?: string) => void
  currentUserName: string
}

export function ChatPanel({
  messages,
  selectedSnippetId,
  snippetTitle,
  onSendMessage,
  currentUserName,
}: ChatPanelProps) {
  const [messageText, setMessageText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const filteredMessages = selectedSnippetId
    ? messages.filter((m) => m.snippetId === selectedSnippetId || m.userId === 'system')
    : messages.filter((m) => m.userId === 'system')

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [filteredMessages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!messageText.trim()) return

    setIsSending(true)
    onSendMessage(messageText.trim(), selectedSnippetId || undefined)
    setMessageText('')

    setTimeout(() => setIsSending(false), 100)
  }

  return (
    <Card className="border-border h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-border">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-accent" />
          {selectedSnippetId ? `Chat: ${snippetTitle}` : 'Room Chat'}
        </CardTitle>
        {selectedSnippetId && (
          <p className="text-xs text-muted-foreground mt-1">
            Showing messages about this code snippet
          </p>
        )}
      </CardHeader>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-48 text-center">
            <p className="text-muted-foreground text-sm">
              {selectedSnippetId
                ? 'No messages about this snippet yet. Start the conversation!'
                : 'No messages yet. Start chatting!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className="space-y-1">
                {msg.userId === 'system' ? (
                  // System Message
                  <div className="text-center py-2">
                    <p className="text-xs text-muted-foreground italic">{msg.text}</p>
                  </div>
                ) : (
                  // User Message
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: msg.userColor }}
                      >
                        {msg.userName?.charAt(0).toUpperCase() ?? '?'}
                      </div>
                      <span className="text-sm font-medium text-foreground">{msg.userName ?? 'Anonymous'}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {msg.snippetTitle && (
                      <p className="text-xs text-accent bg-accent/10 px-2 py-1 rounded w-fit">
                        Re: {msg.snippetTitle}
                      </p>
                    )}
                    <p className="text-sm text-foreground ml-8 break-words">{msg.text}</p>
                  </div>
                )}
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t border-border p-4 space-y-2">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder={
              selectedSnippetId
                ? `Comment on ${snippetTitle}...`
                : 'Type a message...'
            }
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={isSending}
            className="border-border"
          />
          <Button
            type="submit"
            disabled={isSending || !messageText.trim()}
            size="sm"
            className="gap-2"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}
