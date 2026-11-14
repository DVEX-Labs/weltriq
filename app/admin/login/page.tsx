"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck } from "lucide-react";
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

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy flex flex-col justify-center items-center px-4 py-12 text-brand-white relative overflow-hidden font-sans">
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
      <div className="relative z-10 w-full max-w-md bg-white text-brand-navy rounded-2xl shadow-2xl border border-gray-200 p-8 sm:p-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <Image
            src="/logo/weltriq-logo.svg"
            alt="WELTRIQ - Professional Roofing Solutions"
            width={220}
            height={55}
            priority
            className="h-11 sm:h-12 w-auto object-contain mb-4"
          />
          <span className="inline-flex items-center gap-1.5 text-[10px] font-display font-bold uppercase tracking-widest text-brand-navy bg-brand-yellow/25 border border-gray-200 px-3 py-1 rounded-full mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-navy" />
            Admin Portal
          </span>
          <p className="text-xs sm:text-sm text-gray-500 font-sans">
            Sign in to manage services, articles, and roofing solutions
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-display uppercase tracking-wider font-bold text-gray-700 mb-2"
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
              className="w-full bg-gray-50 border border-gray-200 focus:border-brand-navy focus:bg-white h-11 text-brand-navy text-sm rounded-xl font-sans"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-display uppercase tracking-wider font-bold text-gray-700 mb-2"
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
              className="w-full bg-gray-50 border border-gray-200 focus:border-brand-navy focus:bg-white h-11 text-brand-navy text-sm rounded-xl font-sans"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full h-11 text-xs font-display font-bold uppercase tracking-wider bg-brand-yellow hover:bg-[#F3B81F] text-brand-navy rounded-xl shadow-sm transition-all"
          >
            {loading ? "Authenticating..." : "Sign In to Admin"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-center gap-2 text-xs text-gray-400 font-sans">
          <ShieldCheck className="w-4 h-4 text-brand-navy" />
          <span>Encrypted Session • Authorized Access Only</span>
        </div>
      </div>
    </div>
  );
}
