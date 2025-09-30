"use client"

import { useState, useRef, useEffect } from "react"
import ChatSidebar from "@/components/misc/chat-sidebar"
import { ChatMessage } from "./chat-message"
import AI_Input from "../ui/ai-chat"


interface Message {
  id: string
  content: string
  role: "user" | "assistant"
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  lastMessage: string
}

interface ChatInterfaceProps {
  user: { name: string; email: string; avatar?: string }
  onLogout: () => void
}

export function ChatInterface({ user, onLogout }: ChatInterfaceProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConversation = conversations.find(c => c.id === activeConversationId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeConversation?.messages])

  const generateConversationTitle = (firstMessage: string): string => {
    return firstMessage.length > 50 
      ? firstMessage.substring(0, 50) + "..."
      : firstMessage
  }

  const simulateAIResponse = (userMessage: string): string => {
    // Simple AI response simulation
    const responses = [
      "I understand your legal question. Let me help you with that.",
      "Based on legal principles, here's what you should consider...",
      "This is an interesting legal matter. Here's my analysis...",
      "From a legal perspective, there are several important factors to consider.",
      "I can help you understand the legal implications of this situation.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const extractAssistantText = (data: any): string | null => {
    if (!data) return null
    // If webhook returned a plain string
    if (typeof data === "string") return data
    // Common fields
    if (data.message && typeof data.message === "string") return data.message
    if (data.text && typeof data.text === "string") return data.text
    if (data.reply && typeof data.reply === "string") return data.reply

    if (Array.isArray(data) && data.length > 0) {
      const first = data[0]
      if (first && typeof first === "object") {
        if (first.json) return extractAssistantText(first.json)
        if (first.message) return first.message
        if (first.text) return first.text
      }
    }

    try {
      const str = JSON.stringify(data)
      return str.length > 0 ? str : null
    } catch (e) {
      return null
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
    }

    let currentConversation = activeConversation

    if (!currentConversation) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: generateConversationTitle(content),
        messages: [],
        lastMessage: content
      }
      setConversations(prev => [newConversation, ...prev])
      setActiveConversationId(newConversation.id)
      currentConversation = newConversation
    }

    setConversations(prev => prev.map(conv => 
      conv.id === currentConversation!.id
        ? { 
            ...conv, 
            messages: [...conv.messages, newMessage],
            lastMessage: content
          }
        : conv
    ))

    setIsLoading(true)

    try {
      const resp = await fetch("/api/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      })

      let jsonResp: any = null
      try {
        jsonResp = await resp.json();
      } catch (e) {

        console.warn("Failed to parse /api/webhook response as JSON", e)
      }
      const assistantText = (jsonResp && jsonResp.text) ? String(jsonResp.text).trim() : ''
      const finalAssistantText = assistantText || "Failed to get result"

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: finalAssistantText,
        role: "assistant"
      }

      setConversations(prev => prev.map(conv => 
        conv.id === currentConversation!.id
          ? { 
              ...conv, 
              messages: [...conv.messages, aiResponse],
              lastMessage: aiResponse.content
            }
          : conv
      ))
    } catch (err) {
      // On error, fallback to simulated response but keep UX stable
      console.error("Failed to fetch assistant response from webhook", err)
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: simulateAIResponse(content),
        role: "assistant"
      }
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversation!.id
          ? { 
              ...conv, 
              messages: [...conv.messages, fallbackResponse],
              lastMessage: fallbackResponse.content
            }
          : conv
      ))
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewConversation = () => {
    setActiveConversationId(null)
  }

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id)
  }

  return (
    <div className="flex h-screen relative">
      {/* Dark Gray Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "rgb(33, 33, 33)",
          backgroundImage: `
            radial-gradient(circle, rgba(255, 255, 255, 0.0) 1.5px, transparent 1.5px)
          `,
          backgroundSize: "30px 30px",
          backgroundPosition: "0 0",
        }}
      />
      <ChatSidebar
        user={user}
        conversations={conversations}
        activeConversationId={activeConversationId || undefined}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onLogout={onLogout}
      />
      
      <div className="flex-1 flex flex-col relative z-10">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto metallic-scrollbar">
          {activeConversation && activeConversation.messages.length > 0 ? (
            <div className="max-w-4xl mx-auto px-4 py-8">
              {activeConversation.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  userAvatar={user.avatar}
                  userName={user.name}
                />
              ))}
              {isLoading && (
                <div className="flex gap-3 p-4">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-50/20 via-transparent to-blue-100/20 dark:from-blue-950/20 dark:via-transparent dark:to-blue-900/20 border border-blue-200/30 dark:border-blue-800/30 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <div className="bg-gradient-to-br from-blue-50/20 via-transparent to-blue-100/20 dark:from-blue-950/20 dark:via-transparent dark:to-blue-900/20 rounded-2xl px-4 py-3 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-sm">
                    <p className="text-sm text-neutral-300">AI is thinking...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-2xl mx-auto">
                <div className="mb-12">
                  <h1 className="text-4xl font-normal mb-12 text-blue-400">
                    Hello, {user.name.split(' ')[0]}
                  </h1>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area - Always at bottom */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <AI_Input/>
          </div>
        </div>
      </div>
    </div>
  )
}