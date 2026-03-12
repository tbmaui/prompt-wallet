import { supabase } from './client';
import { db, type Prompt } from '@/db/db';

// ─── Stable anonymous user identity ──────────────────────────────────────────
const USER_ID_KEY = 'prompt_wallet_user_id';

export function getUserId(): string {
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(USER_ID_KEY, id);
    }
    return id;
}

// ─── Push a single prompt to Supabase (upsert) ───────────────────────────────
export async function pushPrompt(prompt: Prompt): Promise<void> {
    const userId = getUserId();
    const { error } = await supabase
        .from('prompts')
        .upsert({ ...prompt, user_id: userId }, { onConflict: 'id' });

    if (error) {
        console.error('[Supabase] pushPrompt error:', error.message);
    }
}

// ─── Delete a prompt from Supabase ───────────────────────────────────────────
export async function deletePromptRemote(id: string): Promise<void> {
    const userId = getUserId();
    const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

    if (error) {
        console.error('[Supabase] deletePromptRemote error:', error.message);
    }
}

// ─── Pull all prompts from Supabase and merge into local Dexie ───────────────
// Cloud wins on conflict (by updated_at), so latest edit always survives.
export async function pullAllPrompts(): Promise<void> {
    const userId = getUserId();
    const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('[Supabase] pullAllPrompts error:', error.message);
        return;
    }

    if (!data || data.length === 0) return;

    // Merge: for each cloud prompt, upsert into Dexie only if cloud version is newer
    const localPrompts = await db.prompts.bulkGet(data.map((p) => p.id));
    const toUpsert: Prompt[] = [];

    for (let i = 0; i < data.length; i++) {
        const cloud = data[i] as Prompt;
        const local = localPrompts[i];

        if (!local || cloud.updated_at > local.updated_at) {
            toUpsert.push(cloud);
        }
    }

    if (toUpsert.length > 0) {
        await db.prompts.bulkPut(toUpsert);
        console.log(`[Supabase] Restored ${toUpsert.length} prompts from cloud.`);
    }
}
