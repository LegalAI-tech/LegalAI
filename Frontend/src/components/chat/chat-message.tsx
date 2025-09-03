"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
  };
  userAvatar?: string;
  userName?: string;
}

export function ChatMessage({
  message,
  userAvatar,
  userName,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn("flex gap-3 p-4", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-blue-50/20 via-transparent to-blue-100/20 dark:from-blue-950/20 dark:via-transparent dark:to-blue-900/20 border border-blue-200/30 dark:border-blue-800/30">
            <Bot className="h-4 w-4 text-blue-400" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("max-w-[70%] space-y-1", isUser && "order-first")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm",
            isUser
              ? "bg-blue-600 text-white ml-auto shadow-lg"
              : "bg-gradient-to-br from-blue-50/20 via-transparent to-blue-100/20 dark:from-blue-950/20 dark:via-transparent dark:to-blue-900/20 text-neutral-100 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-sm"
          )}
        >
          <p className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </div>
        <p className={cn("text-xs text-neutral-500", isUser && "text-right")}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          {userAvatar ? (
            <AvatarImage src={userAvatar} alt={userName || "User"} />
          ) : (
            <AvatarFallback className="bg-blue-600 text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          )}
        </Avatar>
      )}
    </div>
  );
}
