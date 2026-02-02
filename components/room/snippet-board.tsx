'use client'

import { motion } from 'framer-motion'
import { Code2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { SnippetCard } from './snippet-card'
import { Snippet } from '@/contexts/room-context'

interface SnippetBoardProps {
  snippets: Snippet[]
  onDeleteSnippet: (id: string) => void
  onSelectSnippet?: (id: string | null) => void
  selectedSnippetId?: string | null
  messages: Array<{ snippetId: string; id: string }>
  isAdmin: boolean
  currentUserId: string
  onEditSnippet?: (snippetId: string, updates: Partial<Snippet>) => void
}

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

export default function SnippetBoard({
  snippets,
  onDeleteSnippet,
  onSelectSnippet,
  selectedSnippetId,
  messages,
  isAdmin,
  currentUserId,
  onEditSnippet,
}: SnippetBoardProps) {
  if (snippets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-full max-w-sm border-border">
          <CardContent className="pt-16 pb-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
              <Code2 className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No snippets yet</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Start the collaboration by adding your first code snippet
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-10 p-4 -mx-4 mb-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Code2 className="w-6 h-6 text-accent" />
          Code Snippets
        </h2>
        <span className="text-sm text-muted-foreground bg-secondary/60 px-3 py-1 rounded-full font-medium">
          {snippets.length}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {snippets.map((snippet) => {
          const snippetMessages = messages.filter(m => m.snippetId === snippet.id)
          const isCreator = snippet.createdById === currentUserId
          return (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              isSelected={selectedSnippetId === snippet.id}
              onSelect={() => onSelectSnippet?.(snippet.id)}
              onDelete={() => onDeleteSnippet(snippet.id)}
              onEdit={(updates) => onEditSnippet?.(snippet.id, updates)}
              messagesCount={snippetMessages.length}
              isAdmin={isAdmin}
              isCreator={isCreator}
            />
          )
        })}
      </div>
    </motion.div>
  )
}
