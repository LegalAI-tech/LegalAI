"use client"

import { useState, useRef, useEffect } from "react"
import ChatSidebar from "@/components/misc/chat-sidebar"
import { ChatMessage } from "./chat-message"
import AI_Input from "../ui/ai-chat"
import { ChatModeSelector } from "../misc/model-selector"
import { TextShimmer } from "../ui/text-shimmer"


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
  const [isNewConversationSelected, setIsNewConversationSelected] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'chat' | 'agentic'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    if (isNewConversationSelected) {
      scrollToTop();
      setIsNewConversationSelected(false);
    } else {
      scrollToBottom();
    }
  }, [activeConversation?.messages, isNewConversationSelected]);

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

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode as 'chat' | 'agentic');
  };

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
    setIsNewConversationSelected(true);
  }

  const handleShareConversation = () => {
    if (!activeConversation) return
    
    // Create a shareable link or copy conversation to clipboard
    const conversationText = activeConversation.messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n')
    
    navigator.clipboard.writeText(conversationText)
      .then(() => {
        // You could show a toast notification here
        console.log('Conversation copied to clipboard')
      })
      .catch(err => {
        console.error('Failed to copy conversation:', err)
      })
  }

  const handleDeleteConversation = () => {
    if (!activeConversation) return
    
    // Remove the conversation from the list
    setConversations(prev => prev.filter(conv => conv.id !== activeConversation.id))
    
    // If we deleted the active conversation, reset to no active conversation
    if (activeConversationId === activeConversation.id) {
      setActiveConversationId(null)
    }
  }

  const handleTempChatClick = () => {
    // Handle temporary chat functionality
    console.log('Temporary chat clicked')
    // You can implement temporary chat logic here
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
        {/* ChatModeSelector */}
        <div className="sticky top-0 z-20 bg-[rgb(33,33,33)]">
          <ChatModeSelector
            variant={activeConversation ? 'chat-selected' : 'default'}
            onModeChange={handleModeChange}
            onTempChatClick={handleTempChatClick}
            onShareClick={handleShareConversation}
            onDeleteClick={handleDeleteConversation}
          />
        </div>

        {/* Messages Area */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto metallic-scrollbar relative">
          {activeConversation && activeConversation.messages.length > 0 ? (
            <>
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
            </>
          ) : (
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center justify-center p-6" style={{ top: 'calc(50% - 30px)' }}>
              <div className="text-center max-w-2xl w-full">
                <div className="mb-4">
                  <h1 className="text-4xl font-semibold mb-4 text-blue-400">
                    Hello {user.name.split(' ')[0]}
                  </h1>
                  <TextShimmer className='font-medium text-sm' duration={4}>
                    How can I assist you with your legal questions today?
                  </TextShimmer>
                  
                </div>
                <div className="w-full">
                  <AI_Input onSendMessage={handleSendMessage} mode={selectedMode} />
                </div>
              </div>
            </div>
          )}
        </div>

        {activeConversation && activeConversation.messages.length > 0 && (
          <div className="pt-1 pb-4">
            <div className="max-w-4xl mx-auto">
              <AI_Input onSendMessage={handleSendMessage} mode={selectedMode} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}