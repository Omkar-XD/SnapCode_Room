'use client'

import { RadioGroupItem } from "@/components/ui/radio-group"
import { RadioGroup } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Code2, Trash2, Sparkles, LogIn, Plus } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { CreateRoomModal } from '@/components/modals/create-room-modal'
import { JoinRoomModal } from '@/components/modals/join-room-modal'

const EXPIRY_OPTIONS = [
  { value: '1h', label: '1 Hour' },
  { value: '1d', label: '1 Day' },
  { value: '1w', label: '1 Week' },
];

export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [selectedExpiry, setSelectedExpiry] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateRoom = () => {
    setIsCreating(true);
    // Logic to create room
    setIsCreating(false);
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header with Theme Toggle */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-accent" />
            <span className="font-bold text-lg">SnapCode</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Hero Section */}
          <div className="text-center mb-12 space-y-6">
            <div className="inline-block">
              <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4 w-fit mx-auto">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Real-time collaboration</span>
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-3">
                SnapCode Room
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Collaborate on code snippets with real-time chat. No accounts, instant setup, password protected.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <Button
              onClick={() => setShowCreateModal(true)}
              size="lg"
              className="h-14 text-base font-semibold gap-2 bg-accent hover:bg-accent/90"
            >
              <Plus className="w-5 h-5" />
              Create a Room
            </Button>
            <Button
              onClick={() => setShowJoinModal(true)}
              variant="outline"
              size="lg"
              className="h-14 text-base font-semibold gap-2 border-accent/30 hover:bg-secondary"
            >
              <LogIn className="w-5 h-5" />
              Join a Room
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border hover:border-accent/50 hover:shadow-md transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Zap className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg">Instant Setup</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Create or join in seconds with just a name and optional password.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-accent/50 hover:shadow-md transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Code2 className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg">Live Chat</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Chat about code snippets and collaborate in real-time.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-accent/50 hover:shadow-md transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Trash2 className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg">Auto-Delete</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Everything disappears when the room expires.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateRoomModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
      <JoinRoomModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} />
    </main>
  )
}
