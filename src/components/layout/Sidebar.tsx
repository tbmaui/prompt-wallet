import { Home, Inbox, Star, Trash2, Folder, Layers, Monitor, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExportService } from '@/lib/export/ExportService';
import { type FilterState } from '@/hooks/usePrompts';

interface SidebarProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

export function Sidebar({ filters, onFilterChange }: SidebarProps) {
    const handleViewChange = (view: FilterState['view']) => {
        onFilterChange({ ...filters, view, discipline: '', domain: '', model: '' });
    };

    const handleFilterClick = (type: 'discipline' | 'domain' | 'model', value: string) => {
        onFilterChange({
            ...filters,
            view: 'all', // Reset to all view when picking a filter
            [type]: filters[type] === value ? '' : value
        });
    };

    return (
        <div className="w-64 border-r bg-muted/10 h-screen flex flex-col">
            <div className="p-4 border-b">
                <h1 className="font-bold text-xl tracking-tight">PromptWallet</h1>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="px-2 space-y-1">
                    <NavItem
                        icon={Inbox}
                        label="Inbox"
                        active={filters.view === 'all' && !filters.discipline && !filters.domain && !filters.model}
                        onClick={() => onFilterChange({ view: 'all', discipline: '', domain: '', model: '' })}
                    />
                    <NavItem
                        icon={Home}
                        label="All Prompts"
                        active={filters.view === 'all' && !filters.discipline && !filters.domain && !filters.model}
                        onClick={() => onFilterChange({ view: 'all', discipline: '', domain: '', model: '' })}
                    />
                    <NavItem
                        icon={Star}
                        label="Favorites"
                        active={filters.view === 'favorites'}
                        onClick={() => handleViewChange('favorites')}
                    />
                    <NavItem
                        icon={Trash2}
                        label="Trash"
                        active={filters.view === 'trash'}
                        onClick={() => handleViewChange('trash')}
                    />
                </nav>

                <div className="mt-8 px-4">
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Disciplines
                    </h2>
                    <div className="space-y-1">
                        {['Website', 'Sales', 'Marketing', 'SAAS', 'Strategy', 'Personal', 'Music', 'Image Generation', 'Other'].map(discipline => (
                            <NavItem
                                key={discipline}
                                icon={Layers}
                                label={discipline}
                                small
                                active={filters.discipline === discipline}
                                onClick={() => handleFilterClick('discipline', discipline)}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-8 px-4">
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Domains
                    </h2>
                    <div className="space-y-1">
                        {['Copy Creation', 'Vibe Coding', 'Automation', 'Sales', 'Systems', 'Story'].map(domain => (
                            <NavItem
                                key={domain}
                                icon={Folder}
                                label={domain}
                                small
                                active={filters.domain === domain}
                                onClick={() => handleFilterClick('domain', domain)}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-8 px-4">
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Models
                    </h2>
                    <div className="space-y-1">
                        {['GPT-4', 'Claude 3', 'Midjourney', 'DALL-E 3', 'Suno'].map(model => (
                            <NavItem
                                key={model}
                                icon={Monitor}
                                label={model}
                                small
                                active={filters.model === model}
                                onClick={() => handleFilterClick('model', model)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 border-t bg-background/50">
                <button
                    onClick={() => ExportService.exportToJson()}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Backup Library
                </button>
            </div>
        </div>
    );
}

function NavItem({ icon: Icon, label, active, small, onClick }: { icon: any, label: string, active?: boolean, small?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                small && "py-1.5 text-xs"
            )}
        >
            <Icon className={cn("w-4 h-4", active ? "text-primary" : "text-muted-foreground")} />
            {label}
        </button>
    );
}
