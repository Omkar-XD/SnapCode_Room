'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Copy, Trash2, MessageCircle, Edit2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Snippet } from '@/contexts/room-context'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { useToast } from '@/hooks/use-toast'

interface SnippetCardProps {
  snippet: Snippet
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onEdit?: (updatedSnippet: Partial<Snippet>) => void
  messagesCount: number
  isAdmin: boolean
  isCreator: boolean
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
}

const chatPanelVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2 },
  },
}

export function SnippetCard({
  snippet,
  isSelected,
  onSelect,
  onDelete,
  onEdit,
  messagesCount,
  isAdmin,
  isCreator,
}: SnippetCardProps) {
  const { toast } = useToast()
  const [showChat, setShowChat] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editTitle, setEditTitle] = useState(snippet.title)
  const [editDescription, setEditDescription] = useState(snippet.description || '')

  const handleCopyCode = () => {
    navigator.clipboard.writeText(snippet.code)
    toast({
      title: 'Copied!',
      description: 'Code copied to clipboard',
      duration: 2000,
    })
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit({
        title: editTitle.trim(),
        description: editDescription.trim(),
      })
      setShowEditModal(false)
      toast({
        title: 'Updated!',
        description: 'Snippet updated successfully',
        duration: 2000,
      })
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    onDelete()
    setShowDeleteConfirm(false)
    toast({
      title: 'Deleted',
      description: 'Snippet has been removed',
      duration: 2000,
    })
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="border border-border rounded-xl overflow-hidden bg-card hover:shadow-lg transition-shadow"
    >
      {/* Header */}
      <motion.button
        onClick={onSelect}
        className={`w-full p-4 flex items-center justify-between bg-gradient-to-r ${
          isSelected
            ? 'from-accent/20 to-accent/10 border-b-2 border-accent'
            : 'from-secondary/40 to-background hover:from-secondary/60'
        } transition-all`}
      >
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            {snippet.title}
            {messagesCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {messagesCount} {messagesCount === 1 ? 'msg' : 'msgs'}
              </Badge>
            )}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{snippet.language}</p>
        </div>
        <motion.div
          animate={{ rotate: isSelected ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </motion.button>

      {/* Code Preview */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border-t border-border"
          >
            {/* Code */}
            <div className="p-4 bg-black/50 overflow-x-auto">
              <SyntaxHighlighter
                language={snippet.language.toLowerCase() || 'javascript'}
                style={atomOneDark}
                customStyle={{
                  padding: '0',
                  margin: '0',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                }}
              >
                {snippet.code}
              </SyntaxHighlighter>
            </div>

            {/* Actions */}
            <div className="flex gap-2 p-4 border-t border-border bg-secondary/20 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyCode}
                className="gap-2 bg-transparent"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>

              {(isAdmin || isCreator) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowEditModal(true)}
                  className="gap-2 bg-transparent"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
              )}

              {(isAdmin || isCreator) && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDeleteClick}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              )}

              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowChat(!showChat)}
                className={`gap-2 ${showChat ? 'bg-accent/20 border-accent' : 'bg-transparent'}`}
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </Button>
            </div>

            {/* Chat Panel */}
            <AnimatePresence>
              {showChat && (
                <motion.div
                  variants={chatPanelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="border-t border-border bg-secondary/30 p-4"
                >
                  <div className="text-xs text-muted-foreground mb-3">
                    Discussion for this snippet ({messagesCount} messages)
                  </div>
                  <div className="bg-background rounded-lg p-3 min-h-[100px] max-h-[300px] overflow-y-auto space-y-2">
                    {messagesCount === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        No messages yet. Be the first to comment!
                      </p>
                    ) : (
                      <p className="text-xs text-foreground">
                        {messagesCount} message{messagesCount !== 1 ? 's' : ''} in discussion
                      </p>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full mt-3 px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="w-5 h-5" />
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
                onClick={handleEdit}
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Delete Snippet?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this snippet? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 rounded-lg bg-secondary/50 border border-destructive/20">
            <p className="text-sm font-mono text-foreground break-all">{snippet.title}</p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              className="flex-1"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
