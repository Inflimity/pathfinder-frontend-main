"use client";

import Link from "next/link";

export default function AuthCodeErrorPage() {
    return (
        <div className="bg-brand-dark text-slate-200 min-h-screen flex flex-col justify-center items-center px-4 bg-noise">
            <div className="w-full max-w-md bg-brand-surface border border-brand-card p-8 md:p-10 shadow-2xl text-center">
                <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
                <p className="text-slate-400 mb-6">
                    There was an error verifying your authentication code. The link may have expired or verified already.
                </p>
                <Link
                    href="/login"
                    className="inline-block bg-brand-bronze hover:bg-brand-bronze-hover text-white py-3 px-6 font-bold uppercase tracking-widest text-xs transition-all"
                >
                    Back to Login
                </Link>
            </div>
        </div>
    );
}
