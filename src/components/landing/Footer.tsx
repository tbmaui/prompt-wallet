export function Footer() {
    return (
        <footer className="py-12 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-sm text-slate-500 dark:text-slate-500">
                    © {new Date().getFullYear()} PromptWallet. All rights reserved.
                </div>
                <div className="flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Twitter</a>
                    <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">GitHub</a>
                </div>
            </div>
        </footer>
    );
}
