'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRoom } from '@/contexts/room-context'
import { Lock } from 'lucide-react'

interface CreateRoomModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const router = useRouter()
  const { createRoom } = useRoom()
  const [roomName, setRoomName] = useState('')
  const [adminName, setAdminName] = useState('')
  const [expiryHours, setExpiryHours] = useState('12')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!roomName.trim() || !adminName.trim()) return

    setIsSubmitting(true)

    try {
      const roomId = await createRoom(roomName.trim(), adminName.trim(), parseInt(expiryHours), password || undefined)
      onClose()
      setTimeout(() => {
        router.push(`/room/${roomId}`)
      }, 50)
    } catch (error) {
      console.error('Failed to create room:', error)
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setRoomName('')
    setAdminName('')
    setExpiryHours('12')
    setPassword('')
    setShowPassword(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create Room</DialogTitle>
          <DialogDescription>
            Set up your collaboration room as an admin
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Room Name */}
          <div className="space-y-2">
            <Label htmlFor="roomname" className="font-semibold">
              Room Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="roomname"
              placeholder="e.g., JavaScript Project, Bug Fix Discussion"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              disabled={isSubmitting}
              className="border-border"
              required
            />
          </div>

          {/* Your Name */}
          <div className="space-y-2">
            <Label htmlFor="adminname" className="font-semibold">
              Your Name (Admin) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="adminname"
              placeholder="Enter your name"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              disabled={isSubmitting}
              className="border-border"
              required
            />
          </div>

          {/* Expiry Time */}
          <div className="space-y-2">
            <Label htmlFor="expiry" className="font-semibold">
              Room expires in <span className="text-destructive">*</span>
            </Label>
            <Select value={expiryHours} onValueChange={setExpiryHours} disabled={isSubmitting}>
              <SelectTrigger id="expiry" className="border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 Hours</SelectItem>
                <SelectItem value="12">12 Hours</SelectItem>
                <SelectItem value="24">24 Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Optional Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="font-semibold flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password <span className="text-muted-foreground text-sm">(optional)</span>
            </Label>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Optional password (leave blank for no password)"
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

          {/* Info Text */}
          <div className="p-3 rounded-lg bg-secondary/50 border border-border text-sm text-muted-foreground">
            You'll be the room admin and can invite others instantly.
          </div>

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
              disabled={isSubmitting || !roomName.trim() || !adminName.trim()}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Room'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
