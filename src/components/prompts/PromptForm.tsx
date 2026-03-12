import { useState } from 'react';
import { X, Plus, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Prompt } from '@/db/db';

interface PromptFormProps {
    initialData?: Partial<Prompt>;
    onSubmit: (data: Partial<Prompt>) => void;
    onCancel: () => void;
}

const DISCIPLINES = ['Website', 'Sales', 'Marketing', 'SAAS', 'Strategy', 'Personal', 'Music', 'Image Generation', 'SEO', 'Content Creation', 'Business Planning', 'Other'];
const DOMAINS = ['Copy Creation', 'Vibe Coding', 'Automation', 'Sales', 'Systems', 'Story'];
const FORMATS = ['Text', 'Code', 'JSON', 'Markdown', 'Table', 'List', 'Image', 'CSV', 'Audio', 'Lyrics', 'MusicXML', 'SVG', 'Figma'];
const MODELS = ['Generic', 'GPT-4', 'Claude 3', 'DALL-E 3', 'Midjourney', 'Suno', 'Udio', 'Stable Diffusion', 'Llama 3'];

export function PromptForm({ initialData, onSubmit, onCancel }: PromptFormProps) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content_raw || '');
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [newTag, setNewTag] = useState('');

    // Taxonomy State
    const [discipline, setDiscipline] = useState<Prompt['discipline']>(initialData?.discipline || 'Website');
    const [selectedDomains, setSelectedDomains] = useState<string[]>(initialData?.domain || []);
    const [format, setFormat] = useState(initialData?.format || '');
    const [model, setModel] = useState(initialData?.model || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            title,
            content_raw: content,
            content_normalized: content.trim(),
            tags,
            source_type: initialData?.source_type || 'MANUAL',
            discipline,
            domain: selectedDomains,
            format,
            model,
        });
    };

    const addTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const toggleDomain = (domain: string) => {
        if (selectedDomains.includes(domain)) {
            setSelectedDomains(selectedDomains.filter(d => d !== domain));
        } else {
            setSelectedDomains([...selectedDomains, domain]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Python Regex Helper"
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Discipline</label>
                    <select
                        value={discipline}
                        onChange={(e) => setDiscipline(e.target.value as any)}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-black dark:text-white"
                    >
                        {DISCIPLINES.map(d => <option key={d} value={d} className="text-black dark:text-white bg-white dark:bg-zinc-950">{d}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Model</label>
                    <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-black dark:text-white"
                    >
                        <option value="" className="text-black dark:text-white bg-white dark:bg-zinc-950">Any Model</option>
                        {MODELS.map(m => <option key={m} value={m} className="text-black dark:text-white bg-white dark:bg-zinc-950">{m}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium text-foreground mb-1">
                    Prompt Content
                </label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter your prompt here..."
                    className="w-full min-h-[200px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
                    required
                />
            </div>

            <div className="space-y-3 pt-2 border-t">
                <h4 className="text-sm font-medium text-muted-foreground">Categorization</h4>

                <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Domains</label>
                    <div className="flex flex-wrap gap-1.5">
                        {DOMAINS.map(d => (
                            <button
                                key={d}
                                type="button"
                                onClick={() => toggleDomain(d)}
                                className={cn(
                                    "px-2.5 py-1 rounded-full text-xs border transition-colors",
                                    selectedDomains.includes(d)
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background hover:bg-muted border-input"
                                )}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Format</label>
                    <div className="flex flex-wrap gap-1.5">
                        {FORMATS.map(f => (
                            <button
                                key={f}
                                type="button"
                                onClick={() => setFormat(format === f ? '' : f)}
                                className={cn(
                                    "px-2.5 py-1 rounded-full text-xs border transition-colors",
                                    format === f
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background hover:bg-muted border-input"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                    Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map(tag => (
                        <span key={tag} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:text-destructive focus:outline-none"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            placeholder="Add a tag..."
                            className="w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={addTag}
                        className="inline-flex items-center justify-center rounded-md border border-input bg-transparent px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    className="inline-flex items-center justify-center rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                    Save Prompt
                </button>
            </div>
        </form>
    );
}
