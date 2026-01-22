import React, { useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { Star, Copy, Edit2, Trash2, Check, RefreshCw } from 'lucide-react';
import { type Prompt } from '@/db/db';
import { cn } from '@/lib/utils';

// Map Disciplines to Colors
const DISCIPLINE_COLOR_MAP: Record<string, string> = {
    'Website': 'cyan',
    'Sales': 'lime',
    'Marketing': 'magenta',
    'SAAS': 'violet',
    'Strategy': 'amber',
    'Personal': 'gray',
    'Music': 'rose',
    'Image Generation': 'indigo',
    'Other': 'slate'
};

// Color configurations for both themes (from SuperDesign)
const colorMap: Record<string, {
    text: string;
    glow: string;
    border: string;
    bgLight: string;
}> = {
    cyan: {
        text: 'text-cyan-600 dark:text-cyan-400',
        glow: 'rgba(34, 211, 238, 0.5)',
        border: 'group-hover:border-cyan-500/30 dark:group-hover:border-cyan-500/50',
        bgLight: 'bg-cyan-500/10'
    },
    amber: {
        text: 'text-amber-600 dark:text-amber-400',
        glow: 'rgba(251, 191, 36, 0.5)',
        border: 'group-hover:border-amber-500/30 dark:group-hover:border-amber-500/50',
        bgLight: 'bg-amber-500/10'
    },
    magenta: {
        text: 'text-fuchsia-600 dark:text-fuchsia-400',
        glow: 'rgba(232, 121, 249, 0.5)',
        border: 'group-hover:border-fuchsia-500/30 dark:group-hover:border-fuchsia-500/50',
        bgLight: 'bg-fuchsia-500/10'
    },
    lime: {
        text: 'text-lime-600 dark:text-lime-400',
        glow: 'rgba(163, 230, 53, 0.5)',
        border: 'group-hover:border-lime-500/30 dark:group-hover:border-lime-500/50',
        bgLight: 'bg-lime-500/10'
    },
    violet: {
        text: 'text-violet-600 dark:text-violet-400',
        glow: 'rgba(139, 92, 246, 0.5)',
        border: 'group-hover:border-violet-500/30 dark:group-hover:border-violet-500/50',
        bgLight: 'bg-violet-500/10'
    },
    rose: {
        text: 'text-rose-600 dark:text-rose-400',
        glow: 'rgba(244, 63, 94, 0.5)',
        border: 'group-hover:border-rose-500/30 dark:group-hover:border-rose-500/50',
        bgLight: 'bg-rose-500/10'
    },
    indigo: {
        text: 'text-indigo-600 dark:text-indigo-400',
        glow: 'rgba(99, 102, 241, 0.5)',
        border: 'group-hover:border-indigo-500/30 dark:group-hover:border-indigo-500/50',
        bgLight: 'bg-indigo-500/10'
    },
    slate: {
        text: 'text-slate-600 dark:text-slate-400',
        glow: 'rgba(148, 163, 184, 0.5)',
        border: 'group-hover:border-slate-500/30 dark:group-hover:border-slate-500/50',
        bgLight: 'bg-slate-500/10'
    },
    gray: {
        text: 'text-gray-600 dark:text-gray-400',
        glow: 'rgba(156, 163, 175, 0.5)',
        border: 'group-hover:border-gray-500/30 dark:group-hover:border-gray-500/50',
        bgLight: 'bg-gray-500/10'
    }
};

interface PromptCardProps {
    prompt: Prompt;
    onEdit: (prompt: Prompt) => void;
    onDelete: (id: string) => void;
    onRestore: (id: string) => void;
    onToggleFavorite: (e: React.MouseEvent, prompt: Prompt) => void;
    view: 'all' | 'favorites' | 'trash';
}

export function PromptCard({ prompt, onEdit, onDelete, onRestore, onToggleFavorite, view }: PromptCardProps) {
    const [isCopied, setIsCopied] = useState(false);

    // Map Discipline to Color Key
    const colorKey = DISCIPLINE_COLOR_MAP[prompt.discipline] || 'slate';
    const colors = colorMap[colorKey] || colorMap['slate'];

    const handleCopy = async () => {
        setIsCopied(true);
        await navigator.clipboard.writeText(prompt.content_raw);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                y: -5,
                scale: 1.02,
                transition: { type: "spring", stiffness: 200, damping: 25 }
            }}
            onMouseMove={undefined}
            className={cn(
                "group relative flex flex-col w-full h-full rounded-2xl",
                // Light Mode Base
                "bg-white/40 border border-slate-200 shadow-sm",
                "hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300",
                // Dark Mode Base
                "dark:bg-zinc-900/40 dark:border-white/10 dark:shadow-none",
                "dark:hover:shadow-2xl dark:hover:shadow-black/50",
                // Common backdrop
                "backdrop-blur-xl backdrop-saturate-150",
                // Static rim lighting effect (Glass Look)
                "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-slate-400/20 dark:before:via-white/50 before:to-transparent",
                colors.border
            )}
        >
            {/* Rim Light Effect - Animated Pulse (Visible on Hover) */}
            <div
                className="absolute inset-x-0 top-0 h-[2px] w-full overflow-hidden rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
            >
                <div
                    className={cn(
                        "absolute top-0 h-full w-[150%] -translate-x-full animate-[shimmer_2s_infinite]",
                        "bg-gradient-to-r from-transparent via-white/80 to-transparent"
                    )}
                    style={{
                        backgroundImage: `linear-gradient(90deg, transparent 0%, ${colors.glow.replace('0.5', '1')} 50%, transparent 100%)`,
                        boxShadow: `0 0 8px 1px ${colors.glow.replace('0.5', '0.8')}`
                    }}
                />
            </div>

            {/* Light Mode: Subtle Gradient Wash */}
            <div
                className={cn(
                    "pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition duration-500 group-hover:opacity-100 dark:hidden",
                    "bg-gradient-to-br from-white via-transparent to-transparent",
                    colors.bgLight.replace('bg-', 'from-').replace('/10', '/30')
                )}
            />

            {/* Inner Content Wrapper */}
            <div className="relative flex flex-col h-full p-5 z-10 w-full">

                {/* Header */}
                <div className="flex items-start justify-between mb-4 w-full">
                    <div className="flex flex-col gap-1.5 flex-1 pr-4">
                        <h3 className={cn("text-lg font-bold tracking-tight dark:tracking-wide dark:drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] line-clamp-1", colors.text)}>
                            {prompt.title}
                        </h3>
                        <span className={cn(
                            "text-[10px] uppercase tracking-widest font-bold border px-1.5 py-0.5 w-fit rounded transition-colors",
                            // Light
                            "text-slate-500 border-slate-200 bg-slate-50",
                            // Dark
                            "dark:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/30"
                        )}>
                            {prompt.discipline}
                        </span>
                    </div>
                    <button
                        onClick={(e) => onToggleFavorite(e, prompt)}
                        className="text-slate-400 dark:text-zinc-500 hover:text-amber-500 dark:hover:text-amber-400 transition-colors duration-200 shrink-0"
                    >
                        <Star
                            size={18}
                            className={cn(
                                "transition-all",
                                prompt.is_favorite && "fill-amber-400 text-amber-400 dark:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                            )}
                        />
                    </button>
                </div>

                {/* Recessed Prompt Content Area */}
                <div className="flex-grow mb-4 relative group/content min-h-[100px]">
                    {/* Background of the content area */}
                    <div className={cn(
                        "absolute inset-0 rounded-xl transition-colors",
                        // Light
                        "bg-slate-50 border border-slate-200/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]",
                        // Dark
                        "dark:bg-black/40 dark:border-white/5 dark:shadow-inner"
                    )} />

                    <div className="relative p-4 h-full overflow-hidden">
                        <p className="text-sm font-mono leading-relaxed line-clamp-4 text-slate-600 dark:text-zinc-300 dark:font-light opacity-90 whitespace-pre-wrap">
                            {prompt.content_normalized}
                        </p>
                        {/* Fade out at bottom */}
                        <div className={cn(
                            "absolute bottom-0 left-0 right-0 h-8",
                            "bg-gradient-to-t from-slate-50 dark:from-black/60 to-transparent"
                        )} />
                    </div>
                </div>

                {/* Footer: Tags & Actions */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-white/5">
                    <div className="flex gap-2 overflow-hidden mask-linear-fade flex-1">
                        {prompt.tags.slice(0, 2).map(tag => (
                            <span
                                key={tag}
                                className={cn(
                                    "text-[10px] px-2 py-1 rounded-full whitespace-nowrap font-medium",
                                    "bg-slate-100 text-slate-500 border border-slate-200",
                                    "dark:bg-zinc-800/20 dark:text-zinc-400 dark:border-zinc-700/50"
                                )}
                            >
                                #{tag}
                            </span>
                        ))}
                        {prompt.tags.length > 2 && (
                            <span className="text-[10px] px-2 py-1 rounded-full border border-transparent dark:border-zinc-700/50 text-slate-400 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-800/20">
                                +{prompt.tags.length - 2}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1 pl-2 shrink-0">
                        {view !== 'trash' ? (
                            <button
                                onClick={() => onEdit(prompt)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:text-zinc-500 dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-colors"
                                title="Edit"
                            >
                                <Edit2 size={14} />
                            </button>
                        ) : (
                            <button
                                onClick={() => onRestore(prompt.id)}
                                className="p-2 text-green-500/80 hover:text-green-600 hover:bg-green-50 dark:hover:text-green-400 dark:hover:bg-green-500/10 rounded-lg transition-colors"
                                title="Restore"
                            >
                                <RefreshCw size={14} />
                            </button>
                        )}

                        <button
                            onClick={() => onDelete(prompt.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:text-zinc-500 dark:hover:text-red-400 dark:hover:bg-red-400/10 rounded-lg transition-colors"
                            title={view === 'trash' ? "Delete Permanently" : "Move to Trash"}
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
