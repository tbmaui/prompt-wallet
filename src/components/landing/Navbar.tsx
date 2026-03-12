import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/50 dark:bg-black/50 border-b border-slate-200/50 dark:border-white/10">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-600 rounded-xl">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">PromptWallet</span>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
                        <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</a>
                        <a href="#about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</a>
                    </div>

                    <Link
                        to="/app"
                        className="px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                        Open Library
                    </Link>
                </div>
            </div>
        </nav>
    );
}
