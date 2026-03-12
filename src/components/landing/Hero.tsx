import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px]" />
                <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-fuchsia-500/20 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6"
                        >
                            <Sparkles size={12} />
                            <span>AI-Powered Prompt Manager</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-500"
                        >
                            Your Second Brain <br /> for Generative AI.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                        >
                            Organize, refine, and master your prompts. PromptWallet helps you build a personal library of high-quality prompts to supercharge your workflow.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                        >
                            <Link
                                to="/app"
                                className="w-full sm:w-auto px-8 py-4 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group"
                            >
                                Open Library
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Hero Image / Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="flex-1 relative"
                    >
                        {/* Abstract card stack visual */}
                        <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-[2rem] opacity-20 blur-3xl" />
                            <div className="relative w-full h-full bg-white/10 dark:bg-black/40 backdrop-blur-2xl rounded-[2rem] border border-white/20 dark:border-white/10 shadow-2xl p-6 flex flex-col">
                                {/* Mock UI content */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/50 dark:border-white/5 backdrop-blur-sm">
                                            <div className="h-2 w-20 bg-slate-200 dark:bg-white/10 rounded mb-2" />
                                            <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Floating elements */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-10 -right-10 p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-slate-100 dark:border-white/10 hidden md:block"
                            >
                                <Sparkles className="w-8 h-8 text-amber-400" />
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
