"use client";

import { Globe, Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";

export default function SidebarAIInput() {
    const [value, setValue] = useState("");
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 40,
        maxHeight: 120,
    });
    const [showSearch, setShowSearch] = useState(true);
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = () => {
        if (!value.trim()) return;
        console.log("Submitting:", value);
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
        <div className="w-full">
            <div className="relative w-full">
                <div
                    role="textbox"
                    tabIndex={0}
                    aria-label="AI chat input"
                    className={cn(
                        "relative flex flex-col rounded-lg transition-all duration-200 w-full text-left cursor-text",
                        "ring-1 ring-neutral-200 dark:ring-neutral-700",
                        isFocused && "ring-2 ring-blue-500 dark:ring-blue-400"
                    )}
                    onClick={handleContainerClick}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            handleContainerClick();
                        }
                    }}
                >
                    <div className="overflow-y-auto max-h-[120px] metallic-scrollbar">
                        <Textarea
                            value={value}
                            placeholder="Ask me anything..."
                            className="w-full rounded-lg rounded-b-none px-3 py-2 bg-white dark:bg-neutral-900 border-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 resize-none focus-visible:ring-0 text-sm leading-[1.3]"
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

                    <div className="h-10 bg-neutral-50 dark:bg-neutral-800 rounded-b-lg border-t border-neutral-200 dark:border-neutral-700">
                        <div className="absolute left-2 bottom-2 flex items-center gap-1">
                            <label className="cursor-pointer rounded-md p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                                <input type="file" className="hidden" />
                                <Paperclip className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                            </label>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowSearch(!showSearch);
                                }}
                                className={cn(
                                    "rounded-full transition-all flex items-center gap-1.5 px-2 py-1 text-xs h-6 cursor-pointer",
                                    showSearch
                                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                        : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-600"
                                )}
                            >
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
                                    <Globe className="w-3 h-3" />
                                </motion.div>
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
                                            className="overflow-hidden whitespace-nowrap shrink-0"
                                        >
                                            Web
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                        <div className="absolute right-2 bottom-2">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!value.trim()}
                                className={cn(
                                    "rounded-md p-1.5 transition-colors",
                                    value.trim()
                                        ? "bg-blue-500 text-white hover:bg-blue-600"
                                        : "bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed"
                                )}
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}