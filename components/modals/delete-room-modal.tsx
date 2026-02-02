'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash2, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface DeleteRoomModalProps {
  isOpen: boolean
  onClose: () => void
  roomId: string
  roomName: string
  onDelete: () => void | Promise<void>
}

export function DeleteRoomModal({ isOpen, onClose, roomId, roomName, onDelete }: DeleteRoomModalProps) {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      localStorage.removeItem(`room_${roomId}`)
      await onDelete()
      onClose()
      setShowConfirm(false)
    } catch (error) {
      console.error('Failed to delete room:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete room. Please try again.',
        variant: 'destructive',
        duration: 3000,
      })
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        {!showConfirm ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive text-lg">
                <AlertTriangle className="w-5 h-5" />
                Delete Room?
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this room? This action cannot be undone. All snippets and chat history will be permanently deleted.
              </DialogDescription>
            </DialogHeader>

            {/* Room Name Display */}
            <div className="p-3 rounded-lg bg-secondary/50 border border-destructive/20">
              <p className="text-sm font-mono text-foreground break-all">{roomName}</p>
            </div>

            {/* Warning Message */}
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-xs text-destructive font-semibold">This action is permanent and cannot be reversed.</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowConfirm(true)}
                disabled={isDeleting}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Room
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive text-lg">
                <AlertTriangle className="w-5 h-5" />
                Confirm Delete?
              </DialogTitle>
              <DialogDescription>
                This is your final confirmation. Once deleted, this room and all its contents will be permanently removed. All users will be disconnected.
              </DialogDescription>
            </DialogHeader>

            {/* Confirmation Message */}
            <div className="p-4 rounded-lg bg-destructive/15 border border-destructive/30 space-y-2">
              <p className="text-sm font-semibold text-destructive">Are you absolutely sure?</p>
              <p className="text-xs text-destructive/80">Room: <span className="font-mono">{roomName}</span></p>
            </div>

            {/* Final Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Permanently Delete
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
