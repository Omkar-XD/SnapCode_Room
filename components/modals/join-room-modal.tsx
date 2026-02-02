'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRoom } from '@/contexts/room-context'
import { useToast } from '@/hooks/use-toast'
import { Lock, AlertCircle } from 'lucide-react'

interface JoinRoomModalProps {
  isOpen: boolean
  onClose: () => void
}

export function JoinRoomModal({ isOpen, onClose }: JoinRoomModalProps) {
  const router = useRouter()
  const { joinRoom, getRoomData } = useRoom()
  const { toast } = useToast()
  
  const [roomInput, setRoomInput] = useState('')
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const extractRoomId = (input: string): string => {
    // Handle full URL or just ID
    const match = input.match(/room\/([a-z0-9]+)/) || input.match(/^[a-z0-9]+$/)
    return match ? (match[1] || match[0]) : input
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!userName.trim()) {
      setError('Please enter your name')
      return
    }

    const roomId = extractRoomId(roomInput.trim())

    if (!roomId) {
      setError('Please enter a valid room ID or link')
      return
    }

    setIsSubmitting(true)

    try {
      const roomData = await getRoomData(roomId)
      if (!roomData) {
        setError('Room not found')
        setIsSubmitting(false)
        return
      }

      const success = await joinRoom(roomId, userName.trim(), password || undefined)
      
      if (!success) {
        setError('Invalid password')
        setIsSubmitting(false)
        return
      }

      router.push(`/room/${roomId}`)
      onClose()
    } catch (err) {
      console.error('Failed to join room:', err)
      setError('Failed to join room')
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setRoomInput('')
    setUserName('')
    setPassword('')
    setShowPassword(false)
    setError('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Join a Room</DialogTitle>
          <DialogDescription>
            Enter the room details to join a collaboration session
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Room Link or ID */}
          <div className="space-y-2">
            <Label htmlFor="room-input" className="font-semibold">
              Paste room link or ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="room-input"
              placeholder="Paste a full invite link or just the room ID"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              disabled={isSubmitting}
              className="border-border font-mono text-sm"
              required
            />
            <p className="text-xs text-muted-foreground">
              You can paste the full URL or just the room ID
            </p>
          </div>

          {/* Your Name */}
          <div className="space-y-2">
            <Label htmlFor="join-username" className="font-semibold">
              Your name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="join-username"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={isSubmitting}
              className="border-border"
              required
            />
          </div>

          {/* Optional Password */}
          <div className="space-y-2">
            <Label htmlFor="join-password" className="font-semibold flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Room password <span className="text-muted-foreground text-sm">(if any)</span>
            </Label>
            <Input
              id="join-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Leave blank if no password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              className="border-border"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-accent hover:underline"
              disabled={isSubmitting}
            >
              {showPassword ? 'Hide' : 'Show'} password
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex gap-2">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !roomInput.trim() || !userName.trim()}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2" />
                  Joining...
                </>
              ) : (
                'Join Room'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
