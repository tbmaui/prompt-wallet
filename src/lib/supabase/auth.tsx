import { useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './client';
import { db } from '@/db/db';
import { AuthContext, type AuthContextValue } from './auth-context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(Boolean(supabase));

    useEffect(() => {
        if (!supabase) {
            return;
        }

        let isMounted = true;

        supabase.auth.getSession().then(({ data }) => {
            if (!isMounted) return;
            setSession(data.session);
            setIsLoading(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
            setSession(nextSession);
            setIsLoading(false);

            if (event === 'SIGNED_OUT') {
                db.prompts.clear();
            }
        });

        return () => {
            isMounted = false;
            listener.subscription.unsubscribe();
        };
    }, []);

    const value = useMemo<AuthContextValue>(() => ({
        isConfigured: Boolean(supabase),
        isLoading,
        session,
        user: session?.user ?? null,
        signInWithMagicLink: async (email: string) => {
            if (!supabase) return { error: 'Supabase is not configured.' };

            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/app`,
                },
            });

            return { error: error?.message ?? null };
        },
        signOut: async () => {
            if (!supabase) return;
            await supabase.auth.signOut();
            await db.prompts.clear();
        },
    }), [isLoading, session]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
