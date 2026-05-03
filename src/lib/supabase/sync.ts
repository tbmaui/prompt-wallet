import { supabase } from './client';
import { db, type Prompt } from '@/db/db';

export async function getUserId(): Promise<string | null> {
    if (!supabase) return null;

    const { data, error } = await supabase.auth.getUser();
    if (error) {
        console.error('[Supabase] getUser error:', error.message);
        return null;
    }

    return data.user?.id ?? null;
}

export async function pushPrompt(prompt: Prompt): Promise<void> {
    if (!supabase) return;

    const userId = await getUserId();
    if (!userId) return;

    const { error } = await supabase
        .from('prompts')
        .upsert({ ...prompt, user_id: userId }, { onConflict: 'id' });

    if (error) {
        console.error('[Supabase] pushPrompt error:', error.message);
    }
}

export async function deletePromptRemote(id: string): Promise<void> {
    if (!supabase) return;

    const userId = await getUserId();
    if (!userId) return;

    const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

    if (error) {
        console.error('[Supabase] deletePromptRemote error:', error.message);
    }
}

export async function pullAllPrompts(): Promise<void> {
    if (!supabase) return;

    const userId = await getUserId();
    if (!userId) return;

    const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('[Supabase] pullAllPrompts error:', error.message);
        return;
    }

    if (!data || data.length === 0) return;

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

export async function pushAllLocalPrompts(): Promise<void> {
    if (!supabase) return;

    const prompts = await db.prompts.toArray();
    await Promise.all(prompts.map((prompt) => pushPrompt(prompt)));
}
