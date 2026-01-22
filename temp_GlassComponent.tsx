/**
 * PromptWallet - Main Page Component
 * 
 * The main container for the application.
 * Manages the state of prompts (add, edit, delete, favorite)
 * and renders the grid.
 * 
 * Features:
 * - Theme Toggle (Light/Dark)
 * - Dynamic Backgrounds for both modes
 */

import React, { useState, useEffect } from 'react';
import { PromptGrid } from './components/PromptGrid';
import { PromptData } from './types';
import { MOCK_PROMPTS } from './data/mockData';
import { Layers, Moon, Sun } from 'lucide-react';
import { cn } from './lib/utils';

export function PromptWallet() {
  const [prompts, setPrompts] = useState<PromptData[]>(MOCK_PROMPTS);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Toggle dark mode class on html element or parent wrapper
  useEffect(() => {
    // In a real app, you might use a ThemeProvider context
    // For this component demo, we'll wrap the content in a div with the class
  }, [isDarkMode]);

  const handleCopy = (text: string) => {
    // Toast logic here
  };

  const handleEdit = (id: string) => {
    console.log('Edit prompt:', id);
  };

  const handleDelete = (id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setPrompts(prev => prev.map(p => 
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    ));
  };

  const handleAddPrompt = () => {
    const newPrompt: PromptData = {
      id: Date.now().toString(),
      title: 'New Prompt Idea',
      category: 'Ideas',
      isFavorite: false,
      content: 'Describe your new prompt idea here...',
      tags: [{ id: 'new-1', label: 'New' }]
    };
    setPrompts([newPrompt, ...prompts]);
  };

  return (
    <div className={cn("min-h-screen transition-colors duration-500 font-sans", isDarkMode ? "dark bg-[#050505] text-white" : "bg-slate-50 text-slate-900")}>
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {isDarkMode ? (
          // Dark Mode Background Effects
          <>
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }} />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
          </>
        ) : (
          // Light Mode Background Effects
          <>
            <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-indigo-200/20 rounded-full blur-[100px]" />
            <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] bg-cyan-200/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[0%] left-[20%] w-[50%] h-[50%] bg-fuchsia-200/20 rounded-full blur-[100px]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-multiply" />
          </>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <header className={cn(
          "sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300",
          isDarkMode ? "bg-black/20 border-white/5" : "bg-white/60 border-slate-200/60"
        )}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Layers className="text-white" size={18} />
              </div>
              <h1 className={cn(
                "text-xl font-bold tracking-tight bg-clip-text text-transparent",
                isDarkMode ? "bg-gradient-to-r from-white to-white/60" : "bg-gradient-to-r from-slate-900 to-slate-600"
              )}>
                Prompt Wallet
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={cn("text-xs font-mono font-medium", isDarkMode ? "text-zinc-500" : "text-slate-500")}>
                {prompts.length} PROMPTS
              </div>
              
              {/* Theme Toggle */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300",
                  isDarkMode ? "bg-zinc-800 text-yellow-400 hover:bg-zinc-700" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                )}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              
              {/* User Avatar Placeholder */}
              <div className={cn("w-8 h-8 rounded-full border", isDarkMode ? "bg-zinc-800 border-white/10" : "bg-slate-200 border-slate-300")} />
            </div>
          </div>
        </header>

        <main>
          <PromptGrid 
            prompts={prompts}
            onCopy={handleCopy}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
            onAddPrompt={handleAddPrompt}
          />
        </main>
      </div>
    </div>
  );
}

export default PromptWallet;
