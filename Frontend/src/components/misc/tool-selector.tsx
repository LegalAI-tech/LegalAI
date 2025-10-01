'use client';

import * as React from 'react';
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


const TranslateIcon = ({ size = 16, ...props }: { size?: number; className?: string }) => (
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
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M9 6.371c0 4.418 -2.239 6.629 -5 6.629" />
    <path d="M4 6.371h7" /><path d="M5 9c0 2.144 2.252 3.908 6 4" />
    <path d="M12 20l4 -9l4 9" /><path d="M19.1 18h-6.2" />
    <path d="M6.694 3l.793 .582" />
   </svg>
);

const DocumentIcon = ({ size = 16, ...props }: { size?: number; className?: string }) => (
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
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M17 20h-11a3 3 0 0 1 0 -6h11a3 3 0 0 0 0 6h1a3 3 0 0 0 3 -3v-11a2 2 0 0 0 -2 -2h-10a2 2 0 0 0 -2 2v8" />
  </svg>
);


export interface Tool {
  value: string;
  label: string;
}

export interface ToolSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  tools?: Tool[];
  onToolChange?: (tool: string) => void;
}

const defaultTools: Tool[] = [
  {
    value: 'docgen',
    label: 'Document Generator',
  },
  {
    value: 'translate',
    label: 'Translator',
  },
];

export const ToolSelector = React.forwardRef<HTMLDivElement, ToolSelectorProps>(
  (
    {
      className,
      tools = defaultTools,
      onToolChange,
      ...props
    },
    ref
  ) => {
    const [selected, setSelected] = React.useState<string>('');

    const handleChange = (val: string) => {
      setSelected(val);
      if (onToolChange) onToolChange(val);
    };

    const selectedLabel =
      tools.find((t) => t.value === selected)?.label ?? 'Select a tool';
    
    const selectedTool = tools.find((t) => t.value === selected);
    const IconComponent = selectedTool?.value === 'translate' ? TranslateIcon : DocumentIcon;

    return (
      <div
        ref={ref}
        className={cn('w-full max-w-xs', className)}
        {...props}
      >
        <Select value={selected} onValueChange={handleChange} aria-label="Select tool">
          <SelectTrigger className="px-3 py-2 rounded-2xl [&>svg]:text-muted-foreground/80 [&>svg]:shrink-0 border border-zinc-200 dark:border-zinc-700 shadow-sm bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <IconComponent size={16} aria-hidden="true" />
            <SelectValue asChild>
              <span className="ml-2">{selectedLabel}</span>
            </SelectValue>
          </SelectTrigger>

          <SelectContent 
            className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 backdrop-blur-sm border border-zinc-400/60 dark:border-zinc-600/20 rounded-2xl shadow-[4px_8px_12px_2px_rgba(0,0,0,0.2)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            style={{ backgroundColor: 'rgb(53, 53, 53)' }}
          >
            <SelectGroup>
              <SelectLabel className="ps-2">Tools</SelectLabel>
              {tools.map((tool) => {
                const ItemIcon = tool.value === 'translate' ? TranslateIcon : DocumentIcon;
                return (
                  <SelectItem 
                    key={tool.value} 
                    value={tool.value}
                    className="hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 data-[highlighted]:bg-zinc-100/80 data-[highlighted]:dark:bg-zinc-800/60 rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-sm border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/50"
                  >
                    <div className="flex items-center gap-2">
                      <ItemIcon size={16} className="shrink-0" aria-hidden="true" />
                      <span>{tool.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  }
);

ToolSelector.displayName = 'ToolSelector';