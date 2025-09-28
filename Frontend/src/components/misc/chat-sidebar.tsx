"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarBody,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Menu, History, Settings, LogOut, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatSidebarProps {
  user: { name: string; email: string; avatar?: string };
  conversations: Array<{
    id: string;
    title: string;
    lastMessage: string;
  }>;
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onLogout: () => void;
}

export default function ChatSidebar({
  user,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onLogout,
}: ChatSidebarProps) {
  const [open, setOpen] = useState(false);

  const navigationLinks = [
    {
      label: "Settings",
      href: "#",
      icon: <Settings className="h-4 w-4" />,
    },
    {
      label: "Logout",
      href: "#",
      icon: <LogOut className="h-4 w-4" />,
      onClick: onLogout,
    },
  ];

  return (
    <Sidebar
      open={open}
      setOpen={setOpen}
      className={cn(
        "transition-all duration-50 ease-linear",
        open ? "w-64" : "w-16"
      )}
    >
      <SidebarBody
        open={open}
        setOpen={setOpen}
        className={cn(
          "justify-between gap-4 p-3 h-full flex flex-col transition-colors duration-300 ease-in-out",
          open ? "bg-neutral-900" : "bg-neutral-800"
        )}
      >
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto metallic-scrollbar transition-all duration-300 ease-in-out">
          {open ? (
            <Logo open={open} setOpen={setOpen} />
          ) : (
            <LogoIcon open={open} setOpen={setOpen} />
          )}

          {/* New Chat Button */}
          <div className="mt-4">
            <Button
              onClick={onNewConversation}
              className={cn(
                "w-full transition-all duration-300 ease-in-out bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700",
                open ? "justify-start gap-2" : "justify-center p-2"
              )}
            >
              <Plus className="h-4 w-4 shrink-0" />
              {open && <span>New Chat</span>}
            </Button>
          </div>

          {/* Recent Chats Section */}
          <div className="mt-6 flex flex-col gap-1 transition-all duration-300 ease-in-out">
            {open ? (
              <>
                <div className="px-2 py-1">
                  <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Recent Chats
                  </h3>
                </div>
                {conversations && conversations.length > 0 ? (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => onSelectConversation(conversation.id)}
                      className={cn(
                        "flex items-center rounded-lg text-sm font-medium transition-all duration-300 ease-in-out text-left w-full gap-3 px-3 py-2",
                        activeConversationId === conversation.id
                          ? "bg-neutral-800 text-neutral-100"
                          : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300"
                      )}
                    >
                      <History className="h-4 w-4 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-neutral-200">
                          {conversation.title}
                        </p>
                        <p className="truncate text-xs text-neutral-500">
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-2 py-2 text-center text-xs text-neutral-500">
                    No conversations yet
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-center p-2">
                <div className="flex items-center justify-center h-8 w-8 rounded-md text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800 transition-colors duration-300 ease-in-out">
                  <History className="h-5 w-5" />
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="mt-auto flex flex-col gap-2 transition-all duration-300 ease-in-out">
            <div className="px-2 py-1">
              {open && (
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Account
                </h3>
              )}
            </div>
            {navigationLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={link.onClick}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium text-neutral-400 transition-all duration-300 ease-in-out hover:bg-neutral-800 hover:text-neutral-300 w-full",
                  open ? "gap-3 px-3 py-2 text-left" : "justify-center p-2"
                )}
                title={open ? undefined : link.label}
              >
                <div className="shrink-0">{link.icon}</div>
                {open && (
                  <span className="text-neutral-300 font-medium">
                    {link.label}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div
          className={cn(
            "flex items-center rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-800 transition-all duration-300 ease-in-out",
            open ? "gap-3 px-3 py-2 text-left" : "justify-center p-2"
          )}
        >
          <Avatar className="h-8 w-8 shrink-0 border border-neutral-700">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name} />
            ) : (
              <AvatarFallback className="bg-neutral-800 border border-neutral-700">
                <User className="h-4 w-4 text-neutral-400" />
              </AvatarFallback>
            )}
          </Avatar>
          {open && (
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-neutral-200">
                {user.name}
              </p>
              <p className="truncate text-xs text-neutral-400">{user.email}</p>
            </div>
          )}
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

const Logo = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      aria-label="Toggle sidebar"
      className={cn(
        "relative z-20 flex items-center rounded-md text-sm font-medium text-neutral-100 hover:bg-neutral-800 transition-all duration-300 ease-in-out",
        open ? "gap-3 px-2 py-2 justify-start" : "justify-center p-2"
      )}
    >
      <span className="grid place-items-center h-8 w-8 rounded-md text-neutral-300 hover:text-neutral-100 transition-colors shrink-0">
        <Menu className="h-5 w-5" aria-hidden="true" />
      </span>
      {open && (
        <span className="text-sm font-semibold text-neutral-100">Legal AI</span>
      )}
    </button>
  );
};

const LogoIcon = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      aria-label="Open sidebar"
      className="relative z-20 grid place-items-center h-10 w-10 rounded-md text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800 transition-all duration-300 ease-in-out shrink-0"
    >
      <Menu className="h-5 w-5" aria-hidden="true" />
    </button>
  );
};
