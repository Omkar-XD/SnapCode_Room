'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { User, Snippet, Message } from '@/contexts/room-context'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

interface SidebarMenuProps {
  users: User[]
  snippets: Snippet[]
  messages: Message[]
  selectedSnippetId: string | null
  onSelectSnippet: (snippetId: string | null) => void
  currentUserId: string
  adminId: string
  isOpen: boolean
  onClose: () => void
}

export function SidebarMenu({
  users,
  snippets,
  messages,
  selectedSnippetId,
  onSelectSnippet,
  currentUserId,
  adminId,
  isOpen,
  onClose,
}: SidebarMenuProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'snippets'>('users')

  const menuVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 25, stiffness: 200 },
    },
    exit: { x: -300, opacity: 0, transition: { duration: 0.2 } },
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const getSnippetUnreadCount = (snippetId: string) => {
    return messages.filter(
      (msg) => msg.snippetId === snippetId && msg.userId !== currentUserId
    ).length
  }

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-30"
          />
        )}
      </AnimatePresence>

      {/* Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed left-0 top-0 h-screen w-80 bg-card border-r border-border z-40 flex flex-col shadow-lg"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card">
              <h2 className="font-bold text-lg">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-4 border-b border-border bg-secondary/50">
              <Button
                variant={activeTab === 'users' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('users')}
                className="flex-1 gap-2"
              >
                <Users className="w-4 h-4" />
                Users
              </Button>
              <Button
                variant={activeTab === 'snippets' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('snippets')}
                className="flex-1 gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Chat
              </Button>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {activeTab === 'users' && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-sm">Active Users</h3>
                      <Badge variant="secondary" className="text-xs">
                        {users.length}
                      </Badge>
                    </div>

                    {users.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No users in room
                      </p>
                    ) : (
                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.05 }}
                      >
                        {users.map((user, index) => (
                          <motion.div
                            key={user.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50"
                          >
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                              style={{ backgroundColor: user.color }}
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate text-foreground">
                                {user.name}
                              </p>
                              {user.id === adminId && (
                                <Badge
                                  variant="outline"
                                  className="text-xs mt-1 bg-yellow-50 text-yellow-700 border-yellow-200"
                                >
                                  Admin
                                </Badge>
                              )}
                              {user.id === currentUserId && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs mt-1 bg-blue-50 text-blue-700 border-blue-200"
                                >
                                  You
                                </Badge>
                              )}
                            </div>
                            <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </>
                )}

                {activeTab === 'snippets' && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-sm">Snippet Discussions</h3>
                      <Badge variant="secondary" className="text-xs">
                        {snippets.length}
                      </Badge>
                    </div>

                    {snippets.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No snippets yet. Create one to start.
                      </p>
                    ) : (
                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.05 }}
                      >
                        {snippets.map((snippet, index) => {
                          const unreadCount = getSnippetUnreadCount(snippet.id)
                          const isSelected = selectedSnippetId === snippet.id

                          return (
                            <motion.button
                              key={snippet.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => {
                                onSelectSnippet(snippet.id)
                                onClose()
                              }}
                              className={`w-full text-left p-3 rounded-lg border transition-all ${
                                isSelected
                                  ? 'bg-accent/10 border-accent'
                                  : 'bg-secondary/50 border-border/50 hover:border-accent/50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium truncate text-foreground">
                                    {snippet.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground font-mono truncate mt-1">
                                    {snippet.language}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    by {snippet.createdBy}
                                  </p>
                                </div>
                                {unreadCount > 0 && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs flex-shrink-0"
                                  >
                                    {unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </motion.button>
                          )
                        })}
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
