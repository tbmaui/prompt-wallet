import { Document } from 'flexsearch';
import { type Prompt } from '@/db/db';

export class SearchService {
    private static instance: SearchService;
    private index: any;

    private constructor() {
        this.index = new Document({
            document: {
                id: 'id',
                index: [
                    'title',
                    'content_normalized',
                    'tags',
                    'discipline',
                    'domain',
                ],
                store: true,
            },
            tokenize: 'forward',
        });
    }

    public static getInstance(): SearchService {
        if (!SearchService.instance) {
            SearchService.instance = new SearchService();
        }
        return SearchService.instance;
    }

    public add(prompt: Prompt) {
        this.index.add(prompt);
    }

    public update(prompt: Prompt) {
        this.index.update(prompt);
    }

    public remove(id: string) {
        this.index.remove(id);
    }

    public search(query: string): Promise<Prompt[]> {
        return new Promise((resolve) => {
            if (!query.trim()) {
                resolve([]);
                return;
            }

            const results = this.index.search(query, {
                limit: 50,
                enrich: true,
            });

            // Flatten results from multiple fields
            const uniquePrompts = new Map<string, Prompt>();

            results.forEach((fieldResult: any) => {
                fieldResult.result.forEach((doc: any) => {
                    uniquePrompts.set(doc.id as string, doc.doc);
                });
            });

            resolve(Array.from(uniquePrompts.values()));
        });
    }

    public clear() {
        // FlexSearch doesn't have a clear method on Document, so we recreate
        // In a real app we might just remove all, but for now this is fine or we just rely on re-indexing on load
    }
}

export const searchService = SearchService.getInstance();
