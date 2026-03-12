import Dexie, { type EntityTable } from 'dexie';

export interface Prompt {
    id: string;
    content_raw: string;
    content_normalized: string;
    title: string;
    description?: string;
    tags: string[];
    variables: string[];
    source_type: 'MANUAL' | 'OCR' | 'CLIPBOARD' | 'IMPORT';

    // Taxonomy Fields
    discipline: 'Website' | 'Sales' | 'Marketing' | 'SAAS' | 'Strategy' | 'Personal' | 'Music' | 'Image Generation' | 'SEO' | 'Content Creation' | 'Business Planning' | 'Other';
    domain?: string[];
    format?: string;
    model?: string;

    created_at: number;
    updated_at: number;
    collection_id?: string;
    is_favorite: boolean;
    is_archived: boolean;
}

export interface Collection {
    id: string;
    name: string;
    parent_id?: string;
    created_at: number;
}

const db = new Dexie('PromptWalletDB') as Dexie & {
    prompts: EntityTable<Prompt, 'id'>;
    collections: EntityTable<Collection, 'id'>;
};

// Version 3: Rename intent to discipline
db.version(3).stores({
    prompts: 'id, title, *tags, source_type, discipline, *domain, format, model, created_at, collection_id, is_favorite',
    collections: 'id, name, parent_id'
}).upgrade(tx => {
    return tx.table('prompts').toCollection().modify(prompt => {
        // Map old intent to new discipline
        // Defaulting to 'Other' as there is no direct mapping for most old intents
        prompt.discipline = 'Other';
        delete prompt.intent;
    });
});

// Version 2: Add taxonomy fields
db.version(2).stores({
    prompts: 'id, title, *tags, source_type, intent, *domain, format, model, created_at, collection_id, is_favorite',
    collections: 'id, name, parent_id'
}).upgrade(tx => {
    // Migration: Set default intent for existing prompts
    return tx.table('prompts').toCollection().modify(prompt => {
        if (!prompt.intent) prompt.intent = 'Generate';
        if (!prompt.domain) prompt.domain = [];
    });
});

// Version 1 (Keep for reference)
db.version(1).stores({
    prompts: 'id, title, *tags, source_type, created_at, collection_id, is_favorite',
    collections: 'id, name, parent_id'
});

export { db };
