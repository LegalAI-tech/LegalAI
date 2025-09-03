"use client"

import { ChatInterface } from "@/components/chat/chat-interface"

export default function DemoPage() {
  const mockUser = {
    name: "John Doe",
    email: "john@example.com"
  }

  const handleLogout = () => {
    console.log("Logout clicked")
  }

  return (
    <ChatInterface user={mockUser} onLogout={handleLogout} />
  )
}