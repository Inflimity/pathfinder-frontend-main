"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push("/dashboard");
            }
        };
        checkSession();
    }, [router, supabase]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        });

        if (resetError) {
            setError(resetError.message);
            setLoading(false);
        } else {
            setLoading(false);
            setSuccess(true);
        }
    };

    return (
        <div className="bg-brand-dark text-slate-200 min-h-screen flex flex-col justify-center items-center px-4 bg-noise">
            <div className="mb-10 text-center">
                <Link href="/" className="text-2xl font-bold tracking-tight text-white inline-flex items-center gap-2">
                    <i className="fa-solid fa-compass text-brand-bronze"></i>
                    PATHFINDER<span className="text-brand-bronze">.AI</span>
                </Link>
            </div>

            <div className="w-full max-w-md bg-brand-surface border border-brand-card p-8 md:p-10 shadow-2xl">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
                    <p className="text-slate-400 text-sm">Enter the email associated with your account and we'll send you a link to reset your password.</p>
                </header>

                {success ? (
                    <div className="space-y-6">
                        <div className="bg-green-500/10 border border-green-500/50 p-6 rounded-sm text-green-400 text-center">
                            <h3 className="font-bold mb-2">Check your email</h3>
                            <p className="text-sm">We have sent a password reset link to <strong>{email}</strong>.</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500 mb-4">
                                Didn't receive the email? Check your spam folder or try again.
                            </p>
                            <button
                                onClick={() => setSuccess(false)}
                                className="text-brand-bronze text-sm font-bold hover:text-white transition"
                            >
                                Try another email
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-sm text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-brand-dark border border-brand-card px-4 py-3 text-white rounded-sm focus:outline-none focus:border-brand-bronze transition-colors placeholder:text-slate-700"
                                placeholder="engineer@pathfinder.ai"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-bronze hover:bg-brand-bronze-hover text-white py-4 font-bold uppercase tracking-widest text-xs transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            SEND RESET LINK
                        </button>
                    </form>
                )}

                <footer className="mt-10 pt-6 border-t border-brand-card text-center">
                    <p className="text-xs text-slate-500">
                        Remember your password? <Link href="/login" className="text-brand-bronze font-bold hover:underline">Log In</Link>
                    </p>
                </footer>
            </div>
            <div className="mt-8">
                <Link href="/" className="text-xs text-slate-600 hover:text-slate-400 transition flex items-center gap-2">
                    <i className="fa-solid fa-arrow-left"></i>
                    Back to Global Landing
                </Link>
            </div>
        </div>
    );
}
