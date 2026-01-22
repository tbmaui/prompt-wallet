import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Prompt } from '@/db/db';
// import { searchService } from '@/lib/search/SearchService';
import { useEffect, useState } from 'react';

export interface FilterState {
    discipline: string;
    domain: string;
    model: string;
    view: 'all' | 'favorites' | 'trash';
}

export function usePrompts(searchQuery: string = '', filters: FilterState = { discipline: '', domain: '', model: '', view: 'all' }) {
    const allPrompts = useLiveQuery(() => db.prompts.orderBy('created_at').reverse().toArray());
    const [searchResults, setSearchResults] = useState<Prompt[] | null>(null);

    // Indexing effect - DISABLED FOR DEBUGGING
    /*
    useEffect(() => {
        if (allPrompts) {
            allPrompts.forEach(p => searchService.add(p));
        }
    }, [allPrompts]);
    */

    // Search and Filter effect
    useEffect(() => {
        const performSearch = async () => {
            let results: Prompt[] | null = null;

            // 1. Text Search
            if (searchQuery.trim()) {
                // FALLBACK SEARCH: Simple text matching
                results = (allPrompts || []).filter(p =>
                    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.content_normalized.toLowerCase().includes(searchQuery.toLowerCase())
                );
                // results = await searchService.search(searchQuery);
            } else {
                results = allPrompts || [];
            }

            // 2. Filter by View (Trash vs Active)
            if (filters.view === 'trash') {
                results = results.filter(p => p.is_archived);
            } else if (filters.view === 'favorites') {
                results = results.filter(p => !p.is_archived && p.is_favorite);
            } else {
                // 'all' view - default
                results = results.filter(p => !p.is_archived);
            }

            // 3. Apply Filters
            if (filters.discipline || filters.domain || filters.model) {
                results = results.filter(p => {
                    const matchDiscipline = !filters.discipline || p.discipline === filters.discipline;
                    const matchDomain = !filters.domain || (p.domain && p.domain.includes(filters.domain));
                    const matchModel = !filters.model || p.model === filters.model;
                    return matchDiscipline && matchDomain && matchModel;
                });
            }

            // Always set results to ensure filtering applies even if just browsing
            setSearchResults(results);
        };
        performSearch();
    }, [searchQuery, filters, allPrompts]);

    const addPrompt = async (prompt: Omit<Prompt, 'id' | 'created_at' | 'updated_at'>) => {
        const now = Date.now();
        const newPrompt: Prompt = {
            ...prompt,
            id: crypto.randomUUID(),
            created_at: now,
            updated_at: now,
            // Ensure defaults for new fields
            discipline: prompt.discipline || 'Website',
            domain: prompt.domain || [],
            format: prompt.format,
            model: prompt.model,
            is_favorite: false,
            is_archived: false,
        };

        await db.prompts.add(newPrompt);
        // searchService.add(newPrompt);
    };

    const updatePrompt = async (id: string, updates: Partial<Prompt>) => {
        const prompt = await db.prompts.get(id);
        if (prompt) {
            const updatedPrompt = { ...prompt, ...updates, updated_at: Date.now() };
            await db.prompts.put(updatedPrompt);
            // searchService.update(updatedPrompt);
        }
    };

    // Soft Delete (Move to Trash)
    const movePromptToTrash = async (id: string) => {
        await updatePrompt(id, { is_archived: true });
    };

    // Restore from Trash
    const restorePrompt = async (id: string) => {
        await updatePrompt(id, { is_archived: false });
    };

    // Hard Delete (Permanent)
    const deletePromptPermanently = async (id: string) => {
        await db.prompts.delete(id);
        // searchService.remove(id);
    };

    return {
        prompts: searchResults || [],
        addPrompt,
        updatePrompt,
        movePromptToTrash,
        restorePrompt,
        deletePromptPermanently
    };
}
