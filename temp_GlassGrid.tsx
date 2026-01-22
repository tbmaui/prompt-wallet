/**
 * PromptGrid Component
 * 
 * Displays a responsive grid of PromptCards with category filtering.
 * Updates:
 * - Added Light/Dark mode support for search inputs, tabs, and empty states.
 */

import React, { useState } from 'react';
import { PromptCard } from './PromptCard';
import { PromptData, Category } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { Search, Plus } from 'lucide-react';

interface PromptGridProps {
  prompts: PromptData[];
  onCopy?: (text: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onAddPrompt?: () => void;
}

const CATEGORIES: (Category | 'All')[] = ['All', 'Generate', 'Coding', 'Business', 'Marketing', 'Writing', 'Ideas'];

export function PromptGrid({ prompts, onCopy, onEdit, onDelete, onToggleFavorite, onAddPrompt }: PromptGridProps) {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrompts = prompts.filter(prompt => {
    const matchesCategory = activeCategory === 'All' || prompt.category === activeCategory;
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prompt.tags.some(tag => tag.label.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Controls Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide mask-fade-right">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border",
                activeCategory === category 
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 border-transparent dark:bg-white dark:text-black dark:shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-900 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 dark:border-white/5"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search & Add */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative group flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-white transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search prompts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full md:w-64 pl-10 pr-4 py-2 rounded-xl transition-all",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-white/20",
                // Light
                "bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-sm",
                // Dark
                "dark:bg-zinc-900/50 dark:border-white/5 dark:text-zinc-200 dark:placeholder:text-zinc-600 dark:shadow-none"
              )}
            />
          </div>
          <button 
            onClick={onAddPrompt}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredPrompts.map(prompt => (
            <PromptCard 
              key={prompt.id} 
              data={prompt} 
              onCopy={onCopy}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredPrompts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-4",
            "bg-slate-100 border border-slate-200 dark:bg-zinc-900/50 dark:border-white/5"
          )}>
            <Search className="text-slate-400 dark:text-zinc-600" size={24} />
          </div>
          <h3 className="text-slate-900 dark:text-zinc-400 font-medium text-lg">No prompts found</h3>
          <p className="text-slate-500 dark:text-zinc-600 text-sm mt-1 max-w-xs">
            Try adjusting your search or category filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}
