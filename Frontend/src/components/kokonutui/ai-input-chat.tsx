"use client";

import { Globe, Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";

interface AIInputChatProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function AI_Input_Chat({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Ask me anything about legal matters..."
}: AIInputChatProps) {
    const [value, setValue] = useState("");
    const [isSending, setIsSending] = useState(false);
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 52,
        maxHeight: 200,
    });
    const [showSearch, setShowSearch] = useState(true);
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = useCallback(async () => {
        const trimmed = value.trim();
        if (!trimmed || disabled || isSending) return;
        onSendMessage(trimmed);
        setIsSending(true);
        setIsSending(false);
        setValue("");
        adjustHeight(true);
    }, [value, disabled, isSending, onSendMessage, adjustHeight]);

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
        <div className="w-full">
            <div className="relative w-full">
                <div
                    role="textbox"
                    tabIndex={0}
                    aria-label="Chat input container"
                    className={cn(
                        "relative flex flex-col rounded-3xl transition-all duration-200 w-full text-left cursor-text",
                        "border border-neutral-700 bg-neutral-800 hover:bg-neutral-750",
                        isFocused && "border-neutral-600 bg-neutral-750"
                    )}
                    onClick={handleContainerClick}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            handleContainerClick();
                        }
                    }}
                >
                    <div className="overflow-y-auto max-h-[200px] metallic-scrollbar">
                        <Textarea
                            id="ai-input-chat"
                            value={value}
                            placeholder={placeholder}
                            disabled={disabled}
                            className="w-full rounded-3xl rounded-b-none px-6 py-4 bg-transparent border-none text-white placeholder:text-neutral-400 resize-none focus-visible:ring-0 leading-[1.4] text-base"
                            ref={textareaRef}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                            onChange={(e) => {
                                setValue(e.target.value);
                                adjustHeight();
                            }}
                        />
                    </div>

                    <div className="h-14 rounded-b-3xl">
                        <div className="absolute left-4 bottom-4 flex items-center gap-3">
                            <label className="cursor-pointer rounded-full p-2 hover:bg-neutral-700 transition-colors">
                                <input type="file" className="hidden" />
                                <Paperclip className="w-5 h-5 text-neutral-400 hover:text-neutral-300 transition-colors" />
                            </label>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowSearch(!showSearch);
                                }}
                                className={cn(
                                    "rounded-full transition-all flex items-center gap-2 px-3 py-2 h-9 cursor-pointer",
                                    showSearch
                                        ? "bg-blue-600/20 text-blue-400"
                                        : "bg-neutral-700 text-neutral-400 hover:bg-neutral-600 hover:text-neutral-300"
                                )}
                            >
                                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                    <motion.div
                                        animate={{
                                            rotate: showSearch ? 180 : 0,
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 25,
                                        }}
                                    >
                                        <Globe className="w-4 h-4" />
                                    </motion.div>
                                </div>
                                <AnimatePresence>
                                    {showSearch && (
                                        <motion.span
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{
                                                width: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{ width: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="text-sm overflow-hidden whitespace-nowrap shrink-0"
                                        >
                                            Tools
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                        <div className="absolute right-4 bottom-4">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!value.trim() || disabled}
                                className={cn(
                                    "rounded-full p-2 transition-colors w-9 h-9 flex items-center justify-center",
                                    value.trim() && !disabled
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-neutral-700 text-neutral-500 cursor-not-allowed"
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