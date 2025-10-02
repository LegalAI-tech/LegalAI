"use client"

import { useState, useRef, useEffect } from "react"
import ChatSidebar from "@/components/misc/chat-sidebar"
import { ChatMessagesArea } from "./chat-message"
import { ChatModeSelector } from "../misc/model-selector"


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
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const [streamingContent, setStreamingContent] = useState<string>("")
  const messagesAreaRef = useRef<{ scrollToBottom: () => void; scrollToTop: () => void }>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId)

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

  const streamText = (text: string, messageId: string, conversationId: string) => {
    const words = text.split(' ')
    let currentIndex = 0
    
    const streamInterval = setInterval(() => {
      if (currentIndex >= words.length) {
        clearInterval(streamInterval)
        setStreamingMessageId(null)
        setStreamingContent("")
        return
      }

      // Render 5-8 words at a time for faster streaming
      const wordsToAdd = Math.min(5 + Math.floor(Math.random() * 4), words.length - currentIndex)
      const nextChunk = words.slice(0, currentIndex + wordsToAdd).join(' ')
      setStreamingContent(nextChunk)
      
      // Update the actual message content in real-time
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId
          ? { 
              ...conv, 
              messages: conv.messages.map(msg =>
                msg.id === messageId ? { ...msg, content: nextChunk } : msg
              ),
              lastMessage: nextChunk
            }
          : conv
      ))
      
      currentIndex += wordsToAdd
    }, 50)

    return () => clearInterval(streamInterval)
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

      setIsLoading(false)
      
      // Create assistant message only when we have the response
      const assistantMessageId = (Date.now() + 1).toString()
      const aiResponse: Message = {
        id: assistantMessageId,
        content: "",
        role: "assistant"
      }

      setConversations(prev => prev.map(conv => 
        conv.id === currentConversation!.id
          ? { 
              ...conv, 
              messages: [...conv.messages, aiResponse],
              lastMessage: ""
            }
          : conv
      ))

      setStreamingMessageId(assistantMessageId)
      
      // Start streaming effect
      streamText(finalAssistantText, assistantMessageId, currentConversation.id)

    } catch (err) {
      console.error("Failed to fetch assistant response from webhook", err)
      const fallbackResponse = simulateAIResponse(content)
      
      setIsLoading(false)
      
      // Create assistant message for fallback response
      const assistantMessageId = (Date.now() + 1).toString()
      const aiResponse: Message = {
        id: assistantMessageId,
        content: "",
        role: "assistant"
      }

      setConversations(prev => prev.map(conv => 
        conv.id === currentConversation!.id
          ? { 
              ...conv, 
              messages: [...conv.messages, aiResponse],
              lastMessage: ""
            }
          : conv
      ))

      setStreamingMessageId(assistantMessageId)
      
      // Stream fallback response
      streamText(fallbackResponse, assistantMessageId, currentConversation.id)
    }
  }

  const handleNewConversation = () => {
    setActiveConversationId(null)
  }

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id)
    setIsNewConversationSelected(true);
    // Reset the flag after a brief moment to allow the animation to complete
    setTimeout(() => setIsNewConversationSelected(false), 100);
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

        <ChatMessagesArea
          ref={messagesAreaRef}
          user={user}
          activeConversation={activeConversation}
          isLoading={isLoading}
          selectedMode={selectedMode}
          streamingMessageId={streamingMessageId}
          streamingContent={streamingContent}
          onSendMessage={handleSendMessage}
          isNewConversationSelected={isNewConversationSelected}
        />
      </div>
    </div>
  )
}