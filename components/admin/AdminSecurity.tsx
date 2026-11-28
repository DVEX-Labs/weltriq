"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";

export function AdminSecurity() {
  const toast = useToast();
  const [username, setUsername] = useState<string>("admin");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Inline status alert
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", title: string, message: string) => {
    toast.showToast(type, title, message);
  };

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/security");
        if (res.ok) {
          const data = await res.json();
          if (data.username) setUsername(data.username);
          if (data.lastUpdated) setLastUpdated(data.lastUpdated);
        }
      } catch (err) {
        console.error("Failed to fetch security details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityData();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!currentPassword) {
      const msg = "Please enter your current password to authorize this update.";
      setStatus({ type: "error", text: msg });
      showToast("error", "Current Password Required", msg);
      return;
    }

    if (newPassword.length < 8) {
      const msg = "New password must be at least 8 characters long.";
      setStatus({ type: "error", text: msg });
      showToast("error", "Password Too Short", msg);
      return;
    }

    if (newPassword !== confirmPassword) {
      const msg = "New password and confirmation do not match.";
      setStatus({ type: "error", text: msg });
      showToast("error", "Passwords Do Not Match", msg);
      return;
    }

    if (currentPassword === newPassword) {
      const msg = "New password must be different from current password.";
      setStatus({ type: "error", text: msg });
      showToast("error", "Password Unchanged", msg);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update password.");
      }

      const successMsg = "Password updated successfully! Please keep your new credentials in a safe place.";
      setStatus({
        type: "success",
        text: successMsg,
      });
      showToast("success", "Password Updated Successfully", "Your new administrator credentials are now active and saved.");

      // Clear fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLastUpdated(new Date().toISOString());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating password.";
      setStatus({ type: "error", text: msg });
      showToast("error", "Update Failed", msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-brand-navy animate-spin" />
        <p className="text-xs font-sans text-gray-500 uppercase tracking-widest font-bold">
          Checking Security Status...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top Header Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="absolute top-0 left-0 right-0 h-1 bg-brand-navy" />

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-display uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-brand-navy/5 text-brand-navy border border-brand-navy/15 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-yellow stroke-[2.2]" />
              Portal Access &amp; Credentials
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display uppercase tracking-tight text-brand-navy font-bold">
            Admin Security &amp; Password
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-sans max-w-2xl leading-relaxed">
            Manage your administrator password and review account security status for the WELTRIQ administrative dashboard.
          </p>
        </div>
      </div>

      {/* Status Message Alert */}
      {status && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
            status.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs sm:text-sm font-sans font-medium">{status.text}</div>
        </div>
      )}

      {/* Current Account Status Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 border border-gray-200/80 flex items-center justify-center shrink-0 shadow-2xs">
              <UserCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-sm font-display uppercase font-bold text-brand-navy tracking-wide">
                Active Administrator Account
              </h2>
              <p className="text-xs text-gray-400 font-sans">Super-admin session details</p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Authenticated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/90 shadow-2xs hover:border-gray-300 transition-colors">
            <span className="text-[10px] font-display uppercase tracking-wider font-bold text-gray-500 block mb-1.5">
              Username
            </span>
            <span className="text-sm font-sans font-bold text-brand-navy block">
              {username}
            </span>
          </div>

          <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/90 shadow-2xs hover:border-gray-300 transition-colors">
            <span className="text-[10px] font-display uppercase tracking-wider font-bold text-gray-500 block mb-1.5">
              Portal Permission
            </span>
            <span className="text-sm font-sans font-bold text-brand-navy block">
              Super Admin (Full Access)
            </span>
          </div>

          <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/90 shadow-2xs hover:border-gray-300 transition-colors">
            <span className="text-[10px] font-display uppercase tracking-wider font-bold text-gray-500 block mb-1.5">
              Last Password Update
            </span>
            <span className="text-sm font-sans font-bold text-brand-navy block">
              {lastUpdated
                ? new Date(lastUpdated).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Initial Configuration"}
            </span>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 border border-gray-200/80 flex items-center justify-center shrink-0 shadow-2xs">
            <KeyRound className="w-5 h-5 text-gray-500 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-sm font-display uppercase font-bold text-brand-navy tracking-wide">
              Change Admin Password
            </h2>
            <p className="text-xs text-gray-400 font-sans">
              Enter your current password and choose a secure new password
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-display uppercase tracking-wider font-bold text-brand-navy mb-1.5">
              Current Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showCurrent ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="w-full pl-9 pr-10 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl text-brand-navy font-sans placeholder:text-gray-400 focus:outline-none focus:border-brand-navy focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-navy p-1"
                aria-label={showCurrent ? "Hide password" : "Show password"}
              >
                {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-gray-400 font-sans mt-1">
              Required to authorize password changes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            {/* New Password */}
            <div>
              <label className="block text-xs font-display uppercase tracking-wider font-bold text-brand-navy mb-1.5">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showNew ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl text-brand-navy font-sans placeholder:text-gray-400 focus:outline-none focus:border-brand-navy focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-navy p-1"
                  aria-label={showNew ? "Hide password" : "Show password"}
                >
                  {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-gray-400 font-sans mt-1">
                Must be at least 8 characters.
              </p>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-display uppercase tracking-wider font-bold text-brand-navy mb-1.5">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl text-brand-navy font-sans placeholder:text-gray-400 focus:outline-none focus:border-brand-navy focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-navy p-1"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {newPassword && confirmPassword && (
                <p
                  className={`text-[11px] font-sans mt-1 font-bold ${
                    newPassword === confirmPassword ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {newPassword === confirmPassword ? "✓ Passwords match" : "✕ Passwords do not match"}
                </p>
              )}
            </div>
          </div>

          {/* Security Recommendation Tips Box */}
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/60 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 font-sans leading-relaxed space-y-1">
              <p className="font-bold">Security Best Practices:</p>
              <p className="text-amber-800">
                Use a strong combination of uppercase letters, numbers, and special symbols. Never share admin credentials with unauthorized personnel.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-[#14204A] text-brand-white font-display uppercase tracking-wider font-bold text-xs shadow-xs hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin text-brand-yellow" />
              ) : (
                <KeyRound className="w-4 h-4 text-brand-yellow stroke-[2.2]" />
              )}
              <span>{saving ? "Updating Password..." : "Update Password"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

