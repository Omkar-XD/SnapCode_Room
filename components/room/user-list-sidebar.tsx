'use client'

import { User } from '@/contexts/room-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Crown } from 'lucide-react'
import { motion } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'

interface UserListSidebarProps {
  users: User[]
  adminId: string
  currentUserId: string
}

export function UserListSidebar({ users, adminId, currentUserId }: UserListSidebarProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <Card className="border-border h-fit sticky top-24 shadow-sm">
      <CardHeader className="pb-3 border-b border-border">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-accent" />
          <span>Members ({users.length})</span>
        </CardTitle>
      </CardHeader>
      <ScrollArea className="h-[400px] w-full">
        <CardContent className="pt-3 px-0">
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No users in room</p>
          ) : (
            <motion.div
              className="space-y-2 px-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  variants={itemVariants}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40 border border-border/50 hover:border-accent/30 hover:bg-secondary/60 transition-all duration-200"
                >
                  {/* User Avatar */}
                  <motion.div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: user.color }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </motion.div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate text-foreground">{user.name}</p>
                      {user.id === adminId && (
                        <Badge variant="outline" className="text-xs gap-1 flex-shrink-0 bg-yellow-50 text-yellow-700 border-yellow-200">
                          <Crown className="w-3 h-3" />
                          Admin
                        </Badge>
                      )}
                      {user.id === currentUserId && (
                        <Badge variant="secondary" className="text-xs flex-shrink-0 bg-blue-50 text-blue-700 border-blue-200">
                          You
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(user.joinedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  )
}
