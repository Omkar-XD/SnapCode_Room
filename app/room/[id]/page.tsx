'use client'

import { SidebarMenu } from "@/components/room/sidebar-menu"

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useRoom } from '@/contexts/room-context'
import RoomHeader from '@/components/room/room-header'
import SnippetBoard from '@/components/room/snippet-board'
import AddSnippetModal from '@/components/room/add-snippet-modal'
import { RoomLayout } from '@/components/room/room-layout'
import { RoomAccessModal } from '@/components/room/room-access-modal'
import { DeleteRoomModal } from '@/components/modals/delete-room-modal'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { useRoomNotifications } from '@/hooks/use-room-notifications'

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string
  const { toast } = useToast()

  const { 
    currentUser, 
    room, 
    isAdmin, 
    messages,
    selectedSnippetId,
    addSnippet, 
    deleteSnippet,
    editSnippet, 
    addMessage,
    selectSnippet,
    getRoomData,
    joinRoom,
    leaveRoom,
    deleteRoom,
  } = useRoom()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showAccessModal, setShowAccessModal] = useState(false)
  const [hasPassword, setHasPassword] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Initialize notifications for join/leave (and "Admin left")
  useRoomNotifications({
    roomId,
    currentUserId: currentUser?.id || null,
    adminId: room?.adminId ?? null,
    users: room?.users ?? [],
  })

  // Load room data on mount
  useEffect(() => {
    const checkRoom = async () => {
      const roomData = await getRoomData(roomId)
      if (!roomData) {
        router.push('/')
        return
      }

      // Check if currentUser exists (they are the creator/admin)
      if (currentUser) {
        // User already has a currentUser set - they're the creator, skip modal
        setIsLoading(false)
        return
      }

      // Check if this is an expired room
      const now = new Date()
      const expiresAt = new Date(roomData.expiresAt)
      
      if (now >= expiresAt) {
        toast({
          title: 'Room Expired',
          description: 'This collaboration room has expired and is no longer available',
          variant: 'destructive',
          duration: 3000,
        })
        router.push('/')
        return
      }

      // If no currentUser but room exists, they need to join
      // Show access modal for joining users
      setHasPassword(!!roomData.password)
      setShowAccessModal(true)
    }

    checkRoom()
  }, [roomId, getRoomData, router, currentUser, toast])

  const handleRoomAccess = async (userName: string, password?: string): Promise<boolean> => {
    try {
      const success = await joinRoom(roomId, userName, password)
      if (success) {
        setShowAccessModal(false)
        setIsLoading(false)
        toast({
          title: 'Success',
          description: `Welcome to the room, ${userName}!`,
          duration: 2000,
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to access room:', error)
      return false
    }
  }

  // Check for room expiration
  useEffect(() => {
    if (!room) return
    
    const checkExpiration = () => {
      const now = new Date()
      const expiresAt = new Date(room.expiresAt)
      
      if (now >= expiresAt) {
        toast({
          title: 'Room Expired',
          description: 'This collaboration room has expired',
          variant: 'destructive',
          duration: 3000,
        })
        leaveRoom()
        router.push('/')
      }
    }
    
    checkExpiration()
    const interval = setInterval(checkExpiration, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [room, router, leaveRoom, toast])

  // When room is deleted or expired (Firebase listener set room to null), show toast and redirect
  const hadRoomRef = useRef(false)
  useEffect(() => {
    if (room) hadRoomRef.current = true
  }, [room])
  useEffect(() => {
    if (currentUser && !room && hadRoomRef.current && roomId) {
      hadRoomRef.current = false
      toast({
        title: 'Room expired or deleted',
        description: 'This room is no longer available. You have been redirected.',
        variant: 'destructive',
        duration: 4000,
      })
      router.push('/')
    }
  }, [currentUser, room, roomId, toast, router])

  // Show access modal if not in room yet
  if (showAccessModal && !currentUser) {
    return (
      <>
        <RoomAccessModal
          isOpen={showAccessModal}
          roomId={roomId}
          hasPassword={hasPassword}
          onAccess={handleRoomAccess}
        />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
            <p className="text-muted-foreground">Preparing room...</p>
          </div>
        </div>
      </>
    )
  }

  if (!room || !currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="text-muted-foreground">Loading room...</p>
        </div>
      </div>
    )
  }

  const selectedSnippet = room.snippets.find(s => s.id === selectedSnippetId)

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Sidebar Menu */}
      {room && currentUser && (
        <SidebarMenu
          users={room.users}
          snippets={room.snippets}
          messages={room.messages}
          selectedSnippetId={selectedSnippetId}
          onSelectSnippet={selectSnippet}
          currentUserId={currentUser.id}
          adminId={room.adminId}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      <RoomHeader 
        roomId={roomId}
        room={room}
        isAdmin={isAdmin}
        currentUserId={currentUser?.id || ''}
        onAddSnippet={() => setIsAddModalOpen(true)}
        onLeaveRoom={() => leaveRoom()}
        onDeleteRoom={() => setShowDeleteModal(true)}
        onOpenMenu={() => setIsSidebarOpen(true)}
      />
      
      <div className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        {/* Main Content Area - Two Column Layout */}
        {room && currentUser && (
          <RoomLayout
            snippets={room.snippets}
            selectedSnippetId={selectedSnippetId}
            onSelectSnippet={selectSnippet}
            onDeleteSnippet={deleteSnippet}
            onEditSnippet={editSnippet}
            messages={messages}
            onAddMessage={addMessage}
            currentUserName={currentUser.name}
            currentUserId={currentUser.id}
            isAdmin={isAdmin}
          />
        )}
      </div>

      {/* Modals */}
      {room && (
        <DeleteRoomModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          roomId={roomId}
          roomName={room.name}
          onDelete={async () => {
            setShowDeleteModal(false)
            await deleteRoom(roomId)
            toast({
              title: 'Room deleted by admin',
              description: 'This room has been permanently deleted',
              variant: 'destructive',
              duration: 3000,
            })
            router.push('/')
          }}
        />
      )}

      <AddSnippetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(snippet) => {
          addSnippet({
            title: snippet.title,
            language: snippet.language,
            code: snippet.code,
            description: snippet.description,
            createdBy: currentUser.name,
          })
          setIsAddModalOpen(false)
          toast({
            title: 'Success',
            description: 'Code snippet added to room',
            duration: 2000,
          })
        }}
        roomId={roomId}
      />

      <Toaster />
    </main>
  )
}
