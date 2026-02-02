'use client'

import React from "react"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, AlertCircle } from 'lucide-react'

interface RoomAccessModalProps {
  isOpen: boolean
  roomId: string
  hasPassword: boolean
  onAccess: (userName: string, password?: string) => Promise<boolean>
}

export function RoomAccessModal({ isOpen, roomId, hasPassword, onAccess }: RoomAccessModalProps) {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!userName.trim()) {
      setError('Please enter your name')
      return
    }

    setIsSubmitting(true)

    try {
      const success = await onAccess(userName.trim(), password || undefined)
      if (!success) {
        setError('Invalid password or unable to access room')
      }
    } catch (err) {
      setError('Failed to access room')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} modal>
      <DialogContent className="max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Enter Room</DialogTitle>
          <DialogDescription>
            Join the room "{roomId}" with your details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Your Name */}
          <div className="space-y-2">
            <Label htmlFor="access-username" className="font-semibold">
              Your name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="access-username"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={isSubmitting}
              className="border-border"
              autoFocus
              required
            />
          </div>

          {/* Password if room has one */}
          {hasPassword && (
            <div className="space-y-2">
              <Label htmlFor="access-password" className="font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Room password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="access-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter room password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="border-border"
                required
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
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex gap-2">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !userName.trim() || (hasPassword && !password.trim())}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2" />
                Entering Room...
              </>
            ) : (
              'Enter Room'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
