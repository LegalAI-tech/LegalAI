"use client";

import { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import { TextShimmer } from "../ui/text-shimmer";
import AITextLoading from "../misc/ai-text-loading";
import AI_Input from "../misc/ai-chat";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastMessage: string;
}

interface ChatMessagesAreaProps {
  user: { name: string; email: string; avatar?: string };
  activeConversation: Conversation | undefined;
  isLoading: boolean;
  selectedMode: 'chat' | 'agentic';
  streamingMessageId: string | null;
  streamingContent: string;
  onSendMessage: (content: string) => void;
  isNewConversationSelected: boolean;
}

interface ChatMessagesAreaRef {
  scrollToBottom: () => void;
  scrollToTop: () => void;
}

// Individual Chat Message Component
function ChatMessage({ message, userAvatar, userName }: {
  message: Message;
  userAvatar?: string;
  userName?: string;
}) {
  const isUser = message.role === "user";

  return (
    <div key={message.id} className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
      {isUser ? (
        // User message - blue bubble, right aligned
        <div className="flex justify-end">
          <div className="max-w-[70%] bg-blue-600 text-white rounded-2xl px-4 py-3 shadow-lg transform transition-all duration-200 hover:shadow-xl">
            <p className="whitespace-pre-wrap leading-relaxed text-sm">
              {message.content}
            </p>
          </div>
        </div>
      ) : (
        // Assistant message - full width, no avatar
        <div className="w-full">
          <div className="text-neutral-100 rounded-2xl p-4">
            <p className="whitespace-pre-wrap leading-relaxed text-sm">
              {message.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

{/* Loading */}
function LoadingMessage() {
  return (
    <div className="flex gap-3 p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-50/20 via-transparent to-blue-100/20 dark:from-blue-950/20 dark:via-transparent dark:to-blue-900/20 border border-blue-200/30 dark:border-blue-800/30 flex items-center justify-center">
        <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse" />
      </div>
      <div className="flex-1 flex justify-start items-center">
        <div className="w-auto">
          <AITextLoading 
            texts={[
              "Analyzing legal context...",
              "Processing your query...",
              "Researching relevant laws...",
              "Formulating response...",
            ]}
            className="!text-sm !font-mono !font-normal !text-neutral-300 !justify-start !text-left"
            interval={800}
          />
        </div>
      </div>
    </div>
  );
}

{/* Welcome Input */}
function WelcomeScreen({ user, onSendMessage, selectedMode }: {
  user: { name: string; email: string; avatar?: string };
  onSendMessage: (content: string) => void;
  selectedMode: 'chat' | 'agentic';
}) {
  return (
    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center justify-center p-6" style={{ top: 'calc(50% - 30px)' }}>
      <div className="text-center max-w-2xl w-full">
        <div className="mb-4">
          <h1 className="text-4xl font-semibold mb-4 text-blue-400">
            Hello {user.name.split(' ')[0]}
          </h1>
          <div>
            <TextShimmer className='font-medium text-sm' duration={4}>
              How can I assist you with your legal questions?
            </TextShimmer>
          </div>
        </div>
        <div className="w-full">
          <AI_Input onSendMessage={onSendMessage} mode={selectedMode} />
        </div>
      </div>
    </div>
  );
}

{/* Main Chat Area */}
export const ChatMessagesArea = forwardRef<ChatMessagesAreaRef, ChatMessagesAreaProps>(
  ({ 
    user,
    activeConversation, 
    isLoading, 
    selectedMode, 
    onSendMessage,
    isNewConversationSelected
  }, ref) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const scrollToTop = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    };

    useImperativeHandle(ref, () => ({
      scrollToBottom,
      scrollToTop
    }));

    useEffect(() => {
      if (isNewConversationSelected) {
        scrollToTop();
      } else {
        scrollToBottom();
      }
    }, [activeConversation?.messages, isNewConversationSelected]);

    const hasMessages = activeConversation && activeConversation.messages.length > 0;

    return (
      <>
        {/* Messages Area */}
        <div 
          ref={scrollContainerRef} 
          className={`flex-1 metallic-scrollbar relative transition-all duration-200 ${
            hasMessages ? 'overflow-y-auto' : 'overflow-hidden'
          }`}
        >
          {hasMessages ? (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
              {activeConversation.messages.map((message) => (
                <ChatMessage 
                  key={message.id}
                  message={message}
                  userAvatar={user.avatar}
                  userName={user.name}
                />
              ))}
              {isLoading && <LoadingMessage />}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <WelcomeScreen 
              user={user}
              onSendMessage={onSendMessage}
              selectedMode={selectedMode}
            />
          )}
        </div>

        {/* Input Area - Only show when there's an active conversation */}
        {hasMessages && (
          <div className="pt-1 pb-4">
            <div className="max-w-4xl mx-auto">
              <AI_Input onSendMessage={onSendMessage} mode={selectedMode} />
            </div>
          </div>
        )}
      </>
    );
  }
);

ChatMessagesArea.displayName = "ChatMessagesArea";

// Export individual ChatMessage for backward compatibility
export { ChatMessage };
