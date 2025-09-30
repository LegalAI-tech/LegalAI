'use client';

import * as React from 'react';
import { MessageCircleDashedIcon} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Custom NorthStar icon component
const NorthStarIcon = ({ size = 16, ...props }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 12h18" />
    <path d="M12 21v-18" />
    <path d="M7.5 7.5l9 9" />
    <path d="M7.5 16.5l9 -9" />
  </svg>
);

// Custom RobotFace icon component
const RobotFaceIcon = ({ size = 16, ...props }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2z" />
    <path d="M9 16c1 .667 2 1 3 1s2 -.333 3 -1" />
    <path d="M9 7l-1 -4" />
    <path d="M15 7l1 -4" />
    <path d="M9 12v-1" />
    <path d="M15 12v-1" />
  </svg>
);
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface ChatMode {
  value: string;
  label: string;
  description?: string;
}

export interface ChatModeSelectorProps extends React.HTMLAttributes<HTMLElement> {
  modes?: ChatMode[];
  defaultMode?: string;
  onModeChange?: (mode: string) => void;
  onTempChatClick?: () => void;
}

const defaultChatModes: ChatMode[] = [
  {
    value: 'chat',
    label: 'Chat',
    description: 'Balanced chatbot experience with RAG capability',
  },
  {
    value: 'agentic',
    label: 'Agent',
    description: 'Multi-agent system tailored for legal professionals',
  },
];

export const ChatModeSelector = React.forwardRef<HTMLElement, ChatModeSelectorProps>(
  (
    {
      className,
      modes = defaultChatModes,
      defaultMode = 'chat',
      onModeChange,
      onTempChatClick,
      ...props
    },
    ref
  ) => {
    const [selected, setSelected] = React.useState<string>(defaultMode);

    React.useEffect(() => {
      setSelected(defaultMode);
    }, [defaultMode]);

    const handleChange = (val: string) => {
      setSelected(val);
      if (onModeChange) onModeChange(val);
    };

    const selectedLabel =
      modes.find((m) => m.value === selected)?.label ?? 'Choose a chat mode';
    
    const selectedMode = modes.find((m) => m.value === selected);
    const IconComponent = selectedMode?.value === 'agentic' ? NorthStarIcon : RobotFaceIcon;

    return (
      <header
        ref={ref}
        className={cn('px-4 md:px-6 [&_*]:no-underline', className)}
        {...props}
      >
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: Chat Mode Selector (controlled) */}
          <Select value={selected} onValueChange={handleChange} aria-label="Select chat mode">
            <SelectTrigger className="[&>svg]:text-muted-foreground/80 [&>svg]:shrink-0">
              <IconComponent size={16} aria-hidden="true" />
              <SelectValue asChild>
                <span className="ml-2">{selectedLabel}</span>
              </SelectValue>
            </SelectTrigger>

            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
              <SelectGroup>
                <SelectLabel className="ps-2">Chat Modes</SelectLabel>
                {modes.map((mode) => {
                  const ItemIcon = mode.value === 'agentic' ? NorthStarIcon : RobotFaceIcon;
                  return (
                    <SelectItem key={mode.value} value={mode.value}>
                      <div className="flex items-start gap-2">
                        <ItemIcon size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                        <div className="flex flex-col">
                          <span>{mode.label}</span>
                          {mode.description ? (
                            <span className="text-muted-foreground text-xs">{mode.description}</span>
                          ) : null}
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Right: Temporary chat button */}
          <Button
            size="icon"
            variant="ghost"
            className="text-muted-foreground size-8 rounded-full shadow-none"
            aria-label="Temporary chat"
            onClick={(e) => {
              e.preventDefault();
              if (onTempChatClick) onTempChatClick();
            }}
          >
            <MessageCircleDashedIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </header>
    );
  }
);

ChatModeSelector.displayName = 'ChatModeSelector';
