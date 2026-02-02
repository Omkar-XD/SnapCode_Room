'use client'

import React from "react"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const LANGUAGE_OPTIONS = [
  'JavaScript',
  'TypeScript',
  'JSX',
  'TSX',
  'Python',
  'Java',
  'C++',
  'C#',
  'Go',
  'Rust',
  'Ruby',
  'PHP',
  'CSS',
  'HTML',
  'SQL',
  'Shell',
  'JSON',
  'YAML',
  'XML',
]

interface AddSnippetModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (snippet: {
    title: string
    language: string
    code: string
    description?: string
  }) => void
  roomId?: string
}

export default function AddSnippetModal({ isOpen, onClose, onAdd, roomId }: AddSnippetModalProps) {
  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('JavaScript')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !code.trim()) {
      return
    }

    setIsSubmitting(true)
    onAdd({
      title: title.trim(),
      language,
      code: code.trim(),
      description: description.trim() || '',
    })
    setTitle('')
    setLanguage('JavaScript')
    setCode('')
    setDescription('')
    setIsSubmitting(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Code Snippet</DialogTitle>
          <DialogDescription>
            Share a code snippet with your team. All fields are required except description.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="font-semibold">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., React Button Component"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-border"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label htmlFor="language" className="font-semibold">
              Language <span className="text-destructive">*</span>
            </Label>
            <Select value={language} onValueChange={setLanguage} disabled={isSubmitting}>
              <SelectTrigger id="language" className="border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Code */}
          <div className="space-y-2">
            <Label htmlFor="code" className="font-semibold">
              Code <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="code"
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono text-sm border-border min-h-48 resize-none"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-semibold">
              Description <span className="text-muted-foreground text-sm">(optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Add any notes or explanation..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-sm border-border min-h-20 resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !code.trim()}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                'Add Snippet'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
