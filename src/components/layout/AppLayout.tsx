import { Sidebar } from './Sidebar';
import { type FilterState } from '@/hooks/usePrompts';

interface AppLayoutProps {
    children: React.ReactNode;
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

export function AppLayout({ children, filters, onFilterChange }: AppLayoutProps) {
    return (
        <div className="flex h-screen w-full text-foreground overflow-hidden relative">
            {/* Dark Mode Organic Background */}
            {/* Dark Mode Organic Background */}
            <div className="fixed inset-0 -z-10 hidden dark:block overflow-hidden pointer-events-none">
                {/* 
                  Refined 'Liquid Neon' System based on User Screenshot
                  High Contrast: Cyan Highlights vs Deep Purple/Black Depths
                */}

                {/* Cyan Glow / Highlight Layer - The "Pop" */}
                <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-cyan-500/40 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-cyan-400/40 rounded-full mix-blend-screen filter blur-[80px] opacity-60 animate-blob animation-delay-2000"></div>

                {/* Deep Liquid Body Layer - Purple/Blue/Indigo */}
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/40 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-blob animation-delay-4000"></div>
                <div className="absolute bottom-[-20%] left-[30%] w-[700px] h-[600px] bg-violet-700/40 rounded-full mix-blend-screen filter blur-[140px] opacity-50 animate-blob"></div>
                <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-blue-700/40 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-blob animation-delay-4000"></div>

                {/* Bottom Center "God Ray" Glow Effect */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-900/30 rounded-full mix-blend-screen filter blur-[150px] opacity-40"></div>

                {/* Deep background base - Pure Black */}
                <div className="absolute inset-0 bg-black -z-20"></div>
            </div>

            <Sidebar filters={filters} onFilterChange={onFilterChange} />
            <div className="flex-1 flex flex-col min-w-0 palm-bg dark:bg-none">
                <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
}
