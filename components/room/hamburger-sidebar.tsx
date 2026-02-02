'use client'

import { useState } from 'react'
import { Menu, X, Code2, MessageSquare, Users, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { User } from '@/contexts/room-context'

interface HamburgerSidebarProps {
  isOpen: boolean
  onClose: () => void
  users: User[]
  currentUserId: string
  adminId: string
}

const sidebarVariants = {
  hidden: { x: -400, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: -400,
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    },
  }),
}

export function HamburgerSidebar({
  isOpen,
  onClose,
  users,
  currentUserId,
  adminId,
}: HamburgerSidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Sidebar */}
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed left-0 top-16 h-[calc(100vh-64px)] w-80 bg-background border-r border-border z-50 shadow-xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-background/95 backdrop-blur">
              <h2 className="text-lg font-bold text-foreground">Room Info</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-80px)]">
              <div className="p-6 space-y-8">
                {/* Members Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-accent" />
                    <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">
                      Members ({users.length})
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {users.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No members yet</p>
                    ) : (
                      users.map((user, i) => (
                        <motion.div
                          key={user.id}
                          custom={i}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition-colors"
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ backgroundColor: user.color }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-foreground">
                              {user.name}
                            </p>
                            {user.id === adminId && (
                              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                                👑 Admin
                              </p>
                            )}
                            {user.id === currentUserId && (
                              <p className="text-xs text-blue-600 dark:text-blue-400">
                                You
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>

                {/* Settings Section */}
                <div className="border-t border-border pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Settings className="w-5 h-5 text-accent" />
                    <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">
                      Quick Access
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={onClose}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      View Chat
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
