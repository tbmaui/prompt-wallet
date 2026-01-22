import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type FilterState } from '@/hooks/usePrompts';

interface FilterBarProps {
    filters: FilterState;
    onChange: (filters: FilterState) => void;
}

const DISCIPLINES = ['Website', 'Sales', 'Marketing', 'SAAS', 'Strategy', 'Personal', 'Music', 'Image Generation', 'Other'];
const DOMAINS = ['Copy Creation', 'Vibe Coding', 'Automation', 'Sales', 'Systems', 'Story'];
const MODELS = ['GPT-4', 'Claude 3', 'DALL-E 3', 'Midjourney', 'Suno', 'Udio', 'Stable Diffusion', 'Llama 3'];

export function FilterBar({ filters, onChange }: FilterBarProps) {
    const updateFilter = (key: keyof FilterState, value: string) => {
        onChange({ ...filters, [key]: value });
    };

    const hasActiveFilters = Object.values(filters).some(Boolean);

    return (
        <div className="flex items-center gap-2 p-2 border-b bg-muted/20 overflow-x-auto">
            <div className="flex items-center text-muted-foreground mr-2">
                <Filter className="w-4 h-4 mr-1" />
                <span className="text-xs font-medium">Filters:</span>
            </div>

            <select
                value={filters.discipline}
                onChange={(e) => updateFilter('discipline', e.target.value)}
                className={cn(
                    "text-xs border rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-ring text-foreground",
                    filters.discipline && "border-primary text-primary font-medium"
                )}
            >
                <option value="" className="text-foreground bg-background">All Disciplines</option>
                {DISCIPLINES.map(d => <option key={d} value={d} className="text-foreground bg-background">{d}</option>)}
            </select>

            <select
                value={filters.domain}
                onChange={(e) => updateFilter('domain', e.target.value)}
                className={cn(
                    "text-xs border rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-ring text-foreground",
                    filters.domain && "border-primary text-primary font-medium"
                )}
            >
                <option value="" className="text-foreground bg-background">All Domains</option>
                {DOMAINS.map(d => <option key={d} value={d} className="text-foreground bg-background">{d}</option>)}
            </select>

            <select
                value={filters.model}
                onChange={(e) => updateFilter('model', e.target.value)}
                className={cn(
                    "text-xs border rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-ring text-foreground",
                    filters.model && "border-primary text-primary font-medium"
                )}
            >
                <option value="" className="text-foreground bg-background">All Models</option>
                {MODELS.map(m => <option key={m} value={m} className="text-foreground bg-background">{m}</option>)}
            </select>

            {hasActiveFilters && (
                <button
                    onClick={() => onChange({ ...filters, discipline: '', domain: '', model: '' })}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors ml-auto mr-2"
                >
                    Clear All
                </button>
            )}
        </div>
    );
}
