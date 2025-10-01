"use client";

import { Paperclip, Send, X } from "lucide-react";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Tool {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface AI_InputProps {
    onSendMessage?: (message: string) => void | Promise<void>;
    mode?: 'chat' | 'agentic';
}

const tools: Tool[] = [
    {
        id: 'doc-generate',
        label: 'Doc Generate',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                <path d="M9 12h6" />
                <path d="M9 16h6" />
            </svg>
        )
    },
    {
        id: 'translate',
        label: 'Translate',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M9 6.371c0 4.418 -2.239 6.629 -5 6.629" />
                <path d="M4 6.371h7" />
                <path d="M5 9c0 2.144 2.252 3.908 6 4" />
                <path d="M12 20l4 -9l4 9" />
                <path d="M19.1 18h-6.2" />
                <path d="M6.694 3l.793 .582" />
            </svg>
        )
    }
];

export default function AI_Input({ onSendMessage, mode = 'chat' }: AI_InputProps) {
    const [value, setValue] = useState("");
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 52,
        maxHeight: 200,
    });
    const [showTools, setShowTools] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

    const handleSubmit = async () => {
        if (!value.trim()) return;
        
        if (onSendMessage) {
            await onSendMessage(value.trim());
        }
        setValue("");
        adjustHeight(true); 
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleContainerClick = () => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    return (
        <div className="w-full py-4">
            <div className="relative max-w-xl w-full mx-auto">
                <div
                    role="textbox"
                    tabIndex={0}
                    aria-label="Search input container"
                    className={cn(
                        "relative flex flex-col rounded-2xl transition-all duration-200 w-full text-left cursor-text",
                        "ring-1 ring-black/10 dark:ring-white/10",
                        isFocused && "ring-black/20 dark:ring-white/20"
                    )}
                    onClick={handleContainerClick}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            handleContainerClick();
                        }
                    }}
                >
                    <div className="overflow-y-auto max-h-[200px]">
                        <Textarea
                            id="ai-input"
                            value={value}
                            placeholder="Ask LegalAI"
                            className="w-full rounded-2xl rounded-b-none px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 resize-none focus-visible:ring-0 leading-[1.2]"
                            ref={textareaRef}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    if (value.trim()) {
                                        handleSubmit();
                                    }
                                }
                            }}
                            onChange={(e) => {
                                setValue(e.target.value);
                                adjustHeight();
                            }}
                        />
                    </div>

                    <div className="h-12 bg-black/5 dark:bg-white/5 rounded-b-2xl">
                        <div className="absolute left-3 bottom-3 flex items-center gap-2">
                            {mode === 'agentic' && (
                                <label className="cursor-pointer rounded-lg p-2 bg-black/5 dark:bg-white/5">
                                    <input type="file" className="hidden" />
                                    <Paperclip className="w-4 h-4 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors" />
                                </label>
                            )}
                            
                            {mode === 'chat' && (
                                <div className="flex items-center gap-2">
                                    <DropdownMenu onOpenChange={setShowTools}>
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                type="button"
                                                className={cn(
                                                    "rounded-full transition-all flex items-center gap-2 px-1.5 py-1 border h-8 cursor-pointer",
                                                    selectedTool || showTools
                                                        ? "bg-sky-500/15 border-sky-400 text-sky-500"
                                                        : "bg-black/5 dark:bg-white/5 border-transparent text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white "
                                                )}
                                            >
                                                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                                    <motion.div
                                                        animate={{
                                                            rotate: showTools ? 180 : 0,
                                                            scale: showTools || selectedTool ? 1.1 : 1,
                                                        }}
                                                        whileHover={{
                                                            rotate: showTools ? 180 : 15,
                                                            scale: 1.1,
                                                            transition: {
                                                                type: "spring",
                                                                stiffness: 300,
                                                                damping: 10,
                                                            },
                                                        }}
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 260,
                                                            damping: 25,
                                                        }}
                                                    >
                                                        {selectedTool ? selectedTool.icon : (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className={cn(
                                                                    "w-4 h-4",
                                                                    showTools
                                                                        ? "text-sky-500"
                                                                        : "text-inherit"
                                                                )}
                                                            >
                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                                <path d="M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6 -6a6 6 0 0 1 -8 -8l3.5 3.5" />
                                                            </svg>
                                                        )}
                                                    </motion.div>
                                                </div>
                                                <AnimatePresence>
                                                    {(showTools || selectedTool) && (
                                                        <motion.span
                                                            initial={{ width: 0, opacity: 0 }}
                                                            animate={{
                                                                width: "auto",
                                                                opacity: 1,
                                                            }}
                                                            exit={{ width: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className={cn(
                                                                "text-sm overflow-hidden whitespace-nowrap shrink-0",
                                                                selectedTool || showTools ? "text-sky-500" : "text-inherit"
                                                            )}
                                                        >
                                                            {selectedTool ? selectedTool.label : "Tools"}
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            side="top"
                                            align="start"
                                            sideOffset={8}
                                            className="w-48 p-2 backdrop-blur-sm border border-zinc-400/60 dark:border-zinc-600/20 rounded-2xl shadow-[4px_8px_12px_2px_rgba(0,0,0,0.2)]"
                                            style={{ backgroundColor: 'rgb(53, 53, 53)' }}
                                        >
                                            <div className="space-y-1">
                                                {tools.map((tool) => (
                                                    <DropdownMenuItem key={tool.id} asChild>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedTool(tool);
                                                                setShowTools(false);
                                                            }}
                                                            className="w-full flex items-center gap-3 p-3 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-sm border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/50"
                                                        >
                                                            <div className="flex items-center gap-2 flex-1">
                                                                {tool.icon}
                                                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight whitespace-nowrap group-hover:text-zinc-950 dark:group-hover:text-zinc-50 transition-colors">
                                                                    {tool.label}
                                                                </span>
                                                            </div>
                                                        </button>
                                                    </DropdownMenuItem>
                                                ))}
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    
                                    {selectedTool && (
                                        <motion.button
                                            type="button"
                                            onClick={() => setSelectedTool(null)}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            transition={{ duration: 0.2, type: "spring", stiffness: 260, damping: 25 }}
                                            className="w-6 h-6 rounded-2xl bg-zinc-200/80 dark:bg-zinc-700/80 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors flex items-center justify-center"
                                        >
                                            <X className="w-3 h-3 text-zinc-600 dark:text-zinc-400" />
                                        </motion.button>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="absolute right-3 bottom-3">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className={cn(
                                    "rounded-lg p-2 transition-colors",
                                    value
                                        ? "bg-sky-500/15 text-sky-500"
                                        : "bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white cursor-pointer"
                                )}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}