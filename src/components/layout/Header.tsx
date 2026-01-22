import { Search, Plus, Moon, Sun, Download, Upload } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { ExportService } from '@/lib/export/ExportService';
import { useRef } from 'react';

interface HeaderProps {
    onSearch: (query: string) => void;
    onNewPrompt: () => void;
}

export function Header({ onSearch, onNewPrompt }: HeaderProps) {
    const { theme, setTheme } = useTheme();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            await ExportService.importFromJson(file);
            alert('Import successful!');
            // Force reload to refresh UI/Search Index (in a real app we'd use a context/signals)
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Import failed');
        }

        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <header className="h-16 border-b flex items-center justify-between px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors">
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search prompts, tags, disciplines..."
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
                    />
                </div>
            </div>

            <div className="ml-4 flex items-center gap-2">
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="inline-flex items-center justify-center rounded-md w-9 h-9 hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    title="Toggle Theme"
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </button>

                <div className="h-6 w-px bg-border mx-1" />

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".json"
                />

                <button
                    onClick={handleImportClick}
                    className="inline-flex items-center justify-center rounded-md w-9 h-9 hover:bg-accent hover:text-accent-foreground transition-colors"
                    title="Import Data"
                >
                    <Upload className="h-4 w-4" />
                </button>

                <button
                    onClick={() => ExportService.exportToJson()}
                    className="inline-flex items-center justify-center rounded-md w-9 h-9 hover:bg-accent hover:text-accent-foreground transition-colors"
                    title="Export Data"
                >
                    <Download className="h-4 w-4" />
                </button>

                <div className="h-6 w-px bg-border mx-1" />

                <button
                    onClick={onNewPrompt}
                    className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Prompt
                </button>
            </div>
        </header>
    );
}
