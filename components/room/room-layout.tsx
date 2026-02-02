'use client'

import { motion } from 'framer-motion'
import { Code2, MessageSquare, Copy, Trash2, Check, Plus, X, Edit } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Snippet, Message } from '@/contexts/room-context'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'

interface RoomLayoutProps {
  snippets: Snippet[]
  selectedSnippetId: string | null
  onSelectSnippet: (id: string | null) => void
  onDeleteSnippet: (id: string) => void
  onEditSnippet?: (snippetId: string, updates: Partial<Snippet>) => void
  messages: Message[]
  onAddMessage: (text: string, snippetId: string, snippetTitle?: string) => void
  currentUserName: string
  currentUserId: string
  isAdmin: boolean
}

const snippetVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 12 },
  },
}

export function RoomLayout({
  snippets,
  selectedSnippetId,
  onSelectSnippet,
  onDeleteSnippet,
  onEditSnippet,
  messages,
  onAddMessage,
  currentUserName,
  currentUserId,
  isAdmin,
}: RoomLayoutProps) {
  const { toast } = useToast()
  const [messageInput, setMessageInput] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const selectedSnippet = snippets.find(s => s.id === selectedSnippetId)
  const snippetMessages = selectedSnippetId ? messages.filter(m => m.snippetId === selectedSnippetId) : []
  const isCreator = selectedSnippet?.createdById === currentUserId

  const handleCopyCode = async (code: string, snippetId: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedId(snippetId)
    toast({
      title: 'Copied!',
      description: 'Code copied to clipboard',
      duration: 2000,
    })
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleOpenEdit = () => {
    if (selectedSnippet) {
      setEditTitle(selectedSnippet.title)
      setEditDescription(selectedSnippet.description || '')
      setShowEditModal(true)
    }
  }

  const handleSaveEdit = () => {
    if (!selectedSnippet || !editTitle.trim()) return
    onEditSnippet?.(selectedSnippet.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
    })
    setShowEditModal(false)
    toast({
      title: 'Updated',
      description: 'Snippet updated successfully',
      duration: 2000,
    })
  }

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedSnippet) return
    onAddMessage(messageInput.trim(), selectedSnippet.id, selectedSnippet.title)
    setMessageInput('')
  }

  // Get system messages (join/leave events)
  const systemMessages = messages.filter(m => m.userId === 'system' && !m.snippetId)

  return (
    <div className="flex-1 flex flex-col gap-4 w-full h-full">
      {/* Room Activity Feed */}
      {systemMessages.length > 0 && (
        <Card className="border-border bg-secondary/30 p-3">
          <div className="text-xs text-muted-foreground space-y-1 max-h-24 overflow-y-auto">
            {systemMessages.map((msg, idx) => (
              <div key={msg.id || idx} className="flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent/60"></span>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Main Grid: Left (Snippets) + Right (Code + Chat) */}
      {snippets.length === 0 ? (
        <Card className="border-border flex-1 flex items-center justify-center">
          <CardContent className="text-center">
            <Code2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No snippets yet</p>
            <p className="text-xs text-muted-foreground/60">Add one to start collaborating</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex gap-6 flex-1 min-h-0">
          {/* LEFT: Code Preview (if selected) OR Snippets List */}
          {selectedSnippet ? (
            <div className="flex-1 flex flex-col gap-4 min-w-0">
              {/* Code Preview Card */}
              <Card className="border-border overflow-hidden flex-1 flex flex-col">
                <CardHeader className="pb-3 bg-gradient-to-r from-accent/10 to-accent/5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base">{selectedSnippet.title}</CardTitle>
                      {selectedSnippet.description && (
                        <CardDescription className="mt-1 text-sm">{selectedSnippet.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyCode(selectedSnippet.code, selectedSnippet.id)}
                        className="gap-2"
                        title="Copy to clipboard"
                      >
                        {copiedId === selectedSnippet.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </Button>
                      {(isAdmin || isCreator) && (
                        <>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={handleOpenEdit}
                            className="h-8 w-8 bg-transparent"
                            title="Edit snippet"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              onDeleteSnippet(selectedSnippet.id)
                              onSelectSnippet(null)
                            }}
                            className="gap-2"
                            title="Delete snippet"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </Button>
                        </>
                      )}
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => onSelectSnippet(null)}
                        className="h-8 w-8"
                        title="Close code view"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="overflow-x-auto bg-black/50 pt-4 pb-4 flex-1">
                  <SyntaxHighlighter language={selectedSnippet.language} style={atomOneDark} className="rounded">
                    {selectedSnippet.code}
                  </SyntaxHighlighter>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2 px-1">
                <h3 className="font-semibold text-sm">Snippets</h3>
                <span className="text-xs text-muted-foreground">({snippets.length})</span>
              </div>
              <ScrollArea className="flex-1 rounded-lg border border-border p-3 bg-secondary/30">
                <motion.div 
                  className="space-y-2"
                  initial="hidden" 
                  animate="visible" 
                  variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                >
                  {snippets.map((snippet) => (
                    <motion.div
                      key={snippet.id}
                      variants={snippetVariants}
                      onClick={() => onSelectSnippet(snippet.id)}
                      className="cursor-pointer"
                    >
                      <Card 
                        className="border-border transition-all duration-200 hover:border-accent/50 hover:bg-secondary/50"
                      >
                        <CardHeader className="p-3">
                          <div className="space-y-2">
                            <CardTitle className="text-sm leading-tight">{snippet.title}</CardTitle>
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2 py-0.5 bg-accent/20 text-accent rounded text-xs font-mono">
                                {snippet.language}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(snippet.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            {snippet.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">{snippet.description}</p>
                            )}
                          </div>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </ScrollArea>
            </div>
          )}

          {/* RIGHT: Chat Discussion */}
          <div className="w-96 flex flex-col min-h-0">
            {selectedSnippet ? (
              <Card className="border-border flex flex-col flex-1 overflow-hidden">
                <CardHeader className="pb-3 border-b border-border flex-shrink-0">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-accent" />
                    Discussion ({snippetMessages.length})
                  </CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {snippetMessages.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">No messages yet. Start discussing!</p>
                    ) : (
                      snippetMessages.map((msg, idx) => (
                        <motion.div
                          key={msg.id || idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg bg-secondary/50 border border-border/50 space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-sm text-accent">{msg.userName || 'Anonymous'}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-foreground break-words">{msg.text}</p>
                        </motion.div>
                      ))
                    )}
                  </div>
                </ScrollArea>
                <div className="border-t border-border p-4 flex gap-2 flex-shrink-0">
                  <Input
                    placeholder="Add a comment..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="text-sm"
                  />
                  <Button 
                    size="sm" 
                    onClick={handleSendMessage} 
                    disabled={!messageInput.trim()}
                  >
                    Send
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="border-border flex-1 flex items-center justify-center">
                <CardContent className="text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Select a snippet to discuss</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Snippet
            </DialogTitle>
            <DialogDescription>
              Update the snippet details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Snippet title"
                className="border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Optional description"
                className="border-border"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveEdit}
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
