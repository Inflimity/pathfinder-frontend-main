"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // If no session (meaning the link didn't log them in or it expired), redirect to login/forgot password
                // But we should check if it was an error or just missing session. 
                // However, without a session we can't update user.
                router.push("/auth/auth-code-error");
            }
        };
        checkSession();
    }, [router, supabase]);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setError(null);

        const { error: updateError } = await supabase.auth.updateUser({
            password: password
        });

        if (updateError) {
            setError(updateError.message);
            setLoading(false);
        } else {
            setLoading(false);
            setSuccess(true);
            // Redirect after a short delay
            setTimeout(() => {
                router.push("/dashboard");
            }, 3000);
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
                    <h1 className="text-2xl font-bold text-white mb-2">Set New Password</h1>
                    <p className="text-slate-400 text-sm">Please create a new password for your account.</p>
                </header>

                {success ? (
                    <div className="space-y-6">
                        <div className="bg-green-500/10 border border-green-500/50 p-6 rounded-sm text-green-400 text-center">
                            <h3 className="font-bold mb-2">Password Updated</h3>
                            <p className="text-sm">Your password has been successfully reset. Redirecting you to the dashboard...</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-sm text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="password" title="New Password" className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-brand-dark border border-brand-card px-4 py-3 text-white rounded-sm focus:outline-none focus:border-brand-bronze transition-colors placeholder:text-slate-700"
                                placeholder="Min 6 characters"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" title="Confirm Password" className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full bg-brand-dark border border-brand-card px-4 py-3 text-white rounded-sm focus:outline-none focus:border-brand-bronze transition-colors placeholder:text-slate-700"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-bronze hover:bg-brand-bronze-hover text-white py-4 font-bold uppercase tracking-widest text-xs transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            UPDATE PASSWORD
                        </button>
                    </form>
                )}
            </div>
            <div className="mt-8">
                <Link href="/login" className="text-xs text-slate-600 hover:text-slate-400 transition flex items-center gap-2">
                    <i className="fa-solid fa-arrow-left"></i>
                    Back to Login
                </Link>
            </div>
        </div>
    );
}
