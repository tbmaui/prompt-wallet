import { useState } from 'react';
import { Mail, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/supabase/auth-context';

interface AuthGateProps {
    children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
    const { isConfigured, isLoading, user, signInWithMagicLink } = useAuth();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setStatus(null);
        setIsSubmitting(true);

        const result = await signInWithMagicLink(email.trim());

        if (result.error) {
            setError(result.error);
        } else {
            setStatus('Check your email for the sign-in link.');
        }

        setIsSubmitting(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen grid place-items-center bg-background text-foreground">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (user) return <>{children}</>;

    return (
        <div className="min-h-screen grid place-items-center bg-slate-50 dark:bg-black text-slate-900 dark:text-white px-6">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur rounded-lg p-6 shadow-sm"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-600 rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl tracking-tight">PromptWallet</h1>
                        <p className="text-sm text-slate-500 dark:text-zinc-400">Sign in to sync your library</p>
                    </div>
                </div>

                {!isConfigured && (
                    <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                        Supabase environment variables are missing.
                    </div>
                )}

                <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={!isConfigured || isSubmitting}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Magic Link
                </button>

                {status && <p className="mt-3 text-sm text-green-600 dark:text-green-400">{status}</p>}
                {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
            </form>
        </div>
    );
}
