import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Header } from '@/components/layout/Header';
import { usePrompts, type FilterState } from '@/hooks/usePrompts';
import { CaptureModal } from '@/components/prompts/CaptureModal';
import { type Prompt } from '@/db/db';
import { FilterBar } from '@/components/prompts/FilterBar';
import { PromptCard } from '@/components/prompts/PromptCard';

export function MainApp() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<FilterState>({ discipline: '', domain: '', model: '', view: 'all' });
    const { prompts, addPrompt, updatePrompt, movePromptToTrash, restorePrompt, deletePromptPermanently } = usePrompts(searchQuery, filters);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

    // Deep Link Catcher for Chrome Extension
    useEffect(() => {
        // 1. Listen for secure payload messages from the Chrome Extension
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'EXTENSION_CAPTURE' && event.data?.text) {
                setEditingPrompt({
                    content_raw: event.data.text,
                    source_type: 'CLIPBOARD',
                } as unknown as Prompt);
                setIsModalOpen(true);
            }
        };
        window.addEventListener('message', handleMessage);

        // 2. Legacy fallback: parse from URL if it was short enough to fit
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('capture') === 'true') {
            const capturedText = searchParams.get('text');
            if (capturedText) {
                // Pre-fill a dummy prompt object with the captured text
                // So the CaptureModal jumps straight to the EDIT step
                setEditingPrompt({
                    content_raw: capturedText,
                    source_type: 'CLIPBOARD',
                    // The rest are defaults that will be overridden by the form/AI
                } as unknown as Prompt);
                setIsModalOpen(true);

                // Clean up the URL so refreshing doesn't re-trigger it
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }

        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const handleCreateOrUpdatePrompt = (data: Partial<Prompt>) => {
        if (editingPrompt) {
            updatePrompt(editingPrompt.id, data);
        } else {
            addPrompt({
                content_raw: data.content_raw || '',
                content_normalized: data.content_normalized || '',
                title: data.title || 'Untitled',
                tags: data.tags || [],
                variables: [],
                source_type: data.source_type || 'MANUAL',
                discipline: data.discipline || 'Website',
                domain: data.domain || [],
                format: data.format,
                model: data.model,
                is_favorite: false,
                is_archived: false
            });
        }
        setIsModalOpen(false);
        setEditingPrompt(null);
    };

    const handleEditClick = (prompt: Prompt) => {
        setEditingPrompt(prompt);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id: string) => {
        if (filters.view === 'trash') {
            if (confirm('Delete this prompt PERMANENTLY? This cannot be undone.')) {
                await deletePromptPermanently(id);
            }
        } else {
            await movePromptToTrash(id);
        }
    };

    const handleRestoreClick = async (id: string) => {
        await restorePrompt(id);
    };

    const toggleFavorite = async (e: React.MouseEvent, prompt: Prompt) => {
        e.stopPropagation();
        await updatePrompt(prompt.id, { is_favorite: !prompt.is_favorite });
    };

    const handleNewPrompt = () => {
        setEditingPrompt(null);
        setIsModalOpen(true);
    };

    return (
        <AppLayout filters={filters} onFilterChange={setFilters}>
            <div className="flex flex-col h-full">
                <Header
                    onSearch={setSearchQuery}
                    onNewPrompt={handleNewPrompt}
                />

                {filters.view !== 'trash' && (
                    <FilterBar filters={filters} onChange={setFilters} />
                )}

                {filters.view === 'trash' && (
                    <div className="bg-destructive/10 p-2 text-center text-sm text-destructive font-medium border-b border-destructive/20">
                        Trash View - Items here are archived.
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold tracking-tight capitalize">
                            {filters.view === 'all' ? 'Library' : filters.view}
                            {searchQuery && ` - Search: "${searchQuery}"`}
                        </h2>
                        <p className="text-muted-foreground">
                            {prompts?.length || 0} prompts found
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {prompts?.map((prompt) => (
                            <PromptCard
                                key={prompt.id}
                                prompt={prompt}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteClick}
                                onRestore={handleRestoreClick}
                                onToggleFavorite={toggleFavorite}
                                view={filters.view}
                            />
                        ))}

                        {prompts?.length === 0 && (
                            <div className="col-span-full text-center text-muted-foreground py-20 border-2 border-dashed rounded-lg">
                                <p>No prompts found.</p>
                                {filters.view === 'all' && !searchQuery && (
                                    <button
                                        onClick={handleNewPrompt}
                                        className="mt-2 text-primary hover:underline"
                                    >
                                        Create your first prompt
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CaptureModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingPrompt(null); }}
                onSave={handleCreateOrUpdatePrompt}
                promptToEdit={editingPrompt}
            />
        </AppLayout>
    );
}
