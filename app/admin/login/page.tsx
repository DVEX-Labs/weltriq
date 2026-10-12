"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed.");
        setLoading(false);
        return;
      }

      router.push("/admin/blogs");
      router.refresh();
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy flex flex-col justify-center items-center px-4 py-12 text-brand-white relative overflow-hidden">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      {/* Top Brand Link */}
      <div className="relative z-10 mb-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-display uppercase tracking-widest text-brand-white/70 hover:text-brand-yellow transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Main Website</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-brand-white text-brand-navy rounded-xl shadow-2xl border border-brand-navy/10 p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-yellow/15 text-brand-navy mb-4 border border-brand-yellow/30">
            <Lock className="h-6 w-6 text-brand-navy" />
          </div>
          <span className="text-xs font-display uppercase tracking-widest font-bold text-brand-yellow block mb-2">
            ADMIN PORTAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-display uppercase text-brand-navy tracking-tight">
            WELTRIQ PUBLISHING
          </h1>
          <p className="text-xs sm:text-sm text-brand-navy/70 mt-1">
            Sign in to manage roofing articles and insights
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-sans flex items-center gap-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-display uppercase tracking-wider font-bold text-brand-navy/80 mb-2"
            >
              Username
            </label>
            <Input
              id="username"
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full bg-brand-island-spice/50 border-brand-navy/20 focus:border-brand-navy h-11 text-brand-navy"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-display uppercase tracking-wider font-bold text-brand-navy/80 mb-2"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-brand-island-spice/50 border-brand-navy/20 focus:border-brand-navy h-11 text-brand-navy"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full h-11 uppercase font-display tracking-wider text-xs font-bold mt-2"
          >
            {loading ? "Authenticating..." : "Sign In to Admin"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-brand-navy/10 flex items-center justify-center gap-2 text-xs text-brand-navy/50">
          <ShieldCheck className="w-4 h-4 text-brand-yellow" />
          <span>Encrypted Session • Authorized Access Only</span>
        </div>
      </div>
    </div>
  );
}
