/**
 * PromptCard Component
 * 
 * A premium 'Smoked Glass' card component that adapts to Light and Dark modes.
 * 
 * DESIGN ADAPTATIONS:
 * - Dark Mode: Deep smoked glass, rim lighting, neon glows, additive blending.
 * - Light Mode: Frosted icy glass, soft colored shadows, jewel-tone text, subtle borders.
 */

import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { Star, Copy, Edit2, Trash2, Check } from 'lucide-react';
import { PromptData, CATEGORY_COLORS } from '../types';
import { cn } from '../lib/utils';

interface PromptCardProps {
  data: PromptData;
  className?: string;
  onCopy?: (text: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

// Color configurations for both themes
const colorMap: Record<string, { 
  text: string; 
  glow: string; 
  border: string;
  bgLight: string; // Background tint for light mode tags
  textLight: string; // Text color for light mode
}> = {
  cyan: { 
    text: 'text-cyan-600 dark:text-cyan-400', 
    textLight: 'text-cyan-700',
    glow: 'rgba(34, 211, 238, 0.5)', 
    border: 'group-hover:border-cyan-500/30 dark:group-hover:border-cyan-500/50',
    bgLight: 'bg-cyan-500/10'
  },
  amber: { 
    text: 'text-amber-600 dark:text-amber-400', 
    textLight: 'text-amber-700',
    glow: 'rgba(251, 191, 36, 0.5)', 
    border: 'group-hover:border-amber-500/30 dark:group-hover:border-amber-500/50',
    bgLight: 'bg-amber-500/10'
  },
  magenta: { 
    text: 'text-fuchsia-600 dark:text-fuchsia-400', 
    textLight: 'text-fuchsia-700',
    glow: 'rgba(232, 121, 249, 0.5)', 
    border: 'group-hover:border-fuchsia-500/30 dark:group-hover:border-fuchsia-500/50',
    bgLight: 'bg-fuchsia-500/10'
  },
  lime: { 
    text: 'text-lime-600 dark:text-lime-400', 
    textLight: 'text-lime-700',
    glow: 'rgba(163, 230, 53, 0.5)', 
    border: 'group-hover:border-lime-500/30 dark:group-hover:border-lime-500/50',
    bgLight: 'bg-lime-500/10'
  },
  violet: { 
    text: 'text-violet-600 dark:text-violet-400', 
    textLight: 'text-violet-700',
    glow: 'rgba(139, 92, 246, 0.5)', 
    border: 'group-hover:border-violet-500/30 dark:group-hover:border-violet-500/50',
    bgLight: 'bg-violet-500/10'
  },
};

export function PromptCard({ data, className, onCopy, onEdit, onDelete, onToggleFavorite }: PromptCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse movement for the spotlight effect
  const mouseXSpring = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const mouseYSpring = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const colorKey = CATEGORY_COLORS[data.category] || 'cyan';
  const colors = colorMap[colorKey];

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  function handleCopy() {
    setIsCopied(true);
    if (onCopy) onCopy(data.content);
    navigator.clipboard.writeText(data.content);
    setTimeout(() => setIsCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -4,
        scale: 1.01,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative flex flex-col w-full h-full rounded-2xl transition-all duration-300",
        // Light Mode Base
        "bg-white/70 border border-slate-200 shadow-sm",
        "hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300",
        // Dark Mode Base
        "dark:bg-zinc-900/40 dark:border-white/10 dark:shadow-none",
        "dark:hover:shadow-2xl dark:hover:shadow-black/50",
        // Common backdrop
        "backdrop-blur-xl",
        // Rim lighting effect (Visible mostly in dark mode, subtle in light)
        "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-slate-400/20 dark:before:via-white/30 before:to-transparent",
        colors.border,
        className
      )}
    >
      {/* Interactivity Gradient / Spotlight */}
      {/* Dark Mode: Colored Glow Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 hidden dark:block"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseXSpring}px ${mouseYSpring}px,
              ${colors.glow},
              transparent 80%
            )
          `
        }}
      />
      {/* Light Mode: Subtle Gradient Wash */}
      <div 
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition duration-500 group-hover:opacity-100 dark:hidden",
          "bg-gradient-to-br from-white via-transparent to-transparent",
          colors.bgLight.replace('bg-', 'from-').replace('/10', '/30') // Hacky tint reuse
        )} 
      />
      
      {/* Inner Content Wrapper */}
      <div className="relative flex flex-col h-full p-5 z-10">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col gap-1.5">
            <h3 className={cn("text-lg font-bold tracking-tight dark:tracking-wide dark:drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]", colors.text)}>
              {data.title}
            </h3>
            <span className={cn(
              "text-[10px] uppercase tracking-widest font-bold border px-1.5 py-0.5 w-fit rounded transition-colors",
              // Light
              "text-slate-500 border-slate-200 bg-slate-50",
              // Dark
              "dark:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/30"
            )}>
              {data.category}
            </span>
          </div>
          <button 
            onClick={() => onToggleFavorite?.(data.id)}
            className="text-slate-400 dark:text-zinc-500 hover:text-amber-500 dark:hover:text-amber-400 transition-colors duration-200"
          >
            <Star 
              size={18} 
              className={cn(
                "transition-all", 
                data.isFavorite && "fill-amber-400 text-amber-400 dark:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
              )} 
            />
          </button>
        </div>

        {/* Recessed Prompt Content Area */}
        <div className="flex-grow mb-4 relative group/content">
          {/* Background of the content area */}
          <div className={cn(
            "absolute inset-0 rounded-xl transition-colors",
            // Light
            "bg-slate-50 border border-slate-200/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]",
            // Dark
            "dark:bg-black/40 dark:border-white/5 dark:shadow-inner"
          )} />
          
          <div className="relative p-4 h-full overflow-hidden">
            <p className="text-sm font-mono leading-relaxed line-clamp-4 text-slate-600 dark:text-zinc-300 dark:font-light opacity-90">
              {data.content}
            </p>
            {/* Fade out at bottom for truncation effect */}
            <div className={cn(
              "absolute bottom-0 left-0 right-0 h-8",
              "bg-gradient-to-t from-slate-50 dark:from-black/60 to-transparent"
            )} />
          </div>
        </div>

        {/* Footer: Tags & Actions */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-white/5">
          <div className="flex gap-2 overflow-hidden mask-linear-fade">
            {data.tags.slice(0, 2).map(tag => (
              <span 
                key={tag.id} 
                className={cn(
                  "text-[10px] px-2 py-1 rounded-full whitespace-nowrap font-medium",
                  // Light
                  "bg-slate-100 text-slate-500 border border-slate-200",
                  // Dark
                  "dark:bg-zinc-800/20 dark:text-zinc-400 dark:border-zinc-700/50"
                )}
              >
                #{tag.label}
              </span>
            ))}
            {data.tags.length > 2 && (
              <span className="text-[10px] px-2 py-1 rounded-full border border-transparent dark:border-zinc-700/50 text-slate-400 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-800/20">
                +{data.tags.length - 2}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 pl-2">
            <button 
              onClick={() => onEdit?.(data.id)}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:text-zinc-500 dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit2 size={14} />
            </button>
            <button 
              onClick={() => onDelete?.(data.id)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:text-zinc-500 dark:hover:text-red-400 dark:hover:bg-red-400/10 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
            <div className="w-px h-4 bg-slate-200 dark:bg-zinc-800 mx-1" />
            <button 
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 border",
                isCopied 
                  ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/50" 
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900 dark:bg-white/5 dark:text-zinc-300 dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-white dark:hover:border-white/20"
              )}
            >
              {isCopied ? <Check size={12} /> : <Copy size={12} />}
              {isCopied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
