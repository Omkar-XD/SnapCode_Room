'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Code2, Plus, Copy, Clock, Check, LogOut, Trash2, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'

interface Room {
  id: string
  name: string
  createdAt: string
  expiresAt: string
  isAdmin?: boolean
  adminId?: string
  users?: Array<{ id: string; name: string }>
}

interface RoomHeaderProps {
  roomId: string
  room: Room | null
  isAdmin: boolean
  currentUserId: string
  onAddSnippet: () => void
  onLeaveRoom?: () => void
  onDeleteRoom?: () => void
  onOpenMenu?: () => void
}

export default function RoomHeader({ roomId, room, isAdmin, currentUserId, onAddSnippet, onLeaveRoom, onDeleteRoom, onOpenMenu }: RoomHeaderProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState('')

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expires = new Date(expiresAt)
    const diff = expires.getTime() - now.getTime()
    
    if (diff <= 0) {
      return 'Expired'
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`
    } else {
      return `${minutes}m remaining`
    }
  }

  useEffect(() => {
    if (!room) return
    
    const updateTime = () => {
      setTimeRemaining(getTimeRemaining(room.expiresAt))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [room])

  const handleLeaveRoom = () => {
    onLeaveRoom?.()
    toast({
      title: 'Left room',
      description: 'You have left the collaboration room',
      duration: 2000,
    })
    router.push('/')
  }

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/room/${roomId}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    toast({
      title: 'Link copied!',
      description: 'Share this link with your team',
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10 backdrop-blur-sm bg-card/80">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left - Hamburger only (no text) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenMenu}
            className="h-8 w-8"
            title="Open menu"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Center - Room Name and Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0">
              <Code2 className="w-5 h-5 text-accent" />
            </Link>
            
            {room && (
              <div className="min-w-0">
                <h1 className="font-semibold text-sm text-foreground truncate">{room.name}</h1>
                <p className="text-xs text-muted-foreground">Room ID: {roomId.substring(0, 8)}</p>
              </div>
            )}
          </div>

          {/* Right - Info and Actions (icons only) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {room && (
              <>
                <div className="flex items-center gap-1 text-xs text-muted-foreground px-2 py-1 bg-secondary/50 rounded" title={`Time remaining: ${timeRemaining}`}>
                  <Clock className="w-3 h-3" />
                  <span className="hidden sm:inline text-xs">{timeRemaining}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-foreground px-2 py-1 bg-accent/20 rounded font-medium" title={`Users: ${room.users?.length || 0}`}>
                  <span className="text-sm">👥</span>
                  <span>{room.users?.length || 0}</span>
                </div>
              </>
            )}

            {/* Action Buttons - Icon only */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyLink}
              className="h-8 w-8"
              title={copied ? "Copied!" : "Copy room link"}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>

            <Button
              size="icon"
              onClick={onAddSnippet}
              className="h-8 w-8"
              title="Add new code snippet"
            >
              <Plus className="w-4 h-4" />
            </Button>

            <ThemeToggle />

            {isAdmin && (
              <Button
                variant="destructive"
                size="icon"
                onClick={onDeleteRoom}
                className="h-8 w-8"
                title="Delete the room"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLeaveRoom}
              className="h-8 w-8"
              title="Leave the room"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
