"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit, Trash2, Layers, AlertCircle, AlertTriangle, X } from "lucide-react";
import { ManagedService } from "@/lib/services/types";
import { Button } from "@/components/ui/Button";

interface AdminServiceListProps {
  initialServices: ManagedService[];
}

export function AdminServiceList({ initialServices }: AdminServiceListProps) {
  const [services, setServices] = useState<ManagedService[]>(initialServices);
  const [search, setSearch] = useState("");
  const [deletingService, setDeletingService] = useState<ManagedService | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deletingService) return;

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/admin/services?id=${encodeURIComponent(deletingService.id)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete service.");
      }

      setServices((prev) => prev.filter((s) => s.id !== deletingService.id));
      setDeletingService(null);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to delete service.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-display uppercase font-bold text-brand-navy tracking-tight">
              Roofing Services
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
              {services.length} active service
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-sans leading-relaxed">
            Manage service cards displayed in the homepage sticky stacking deck and the Services catalogue page.
          </p>
        </div>

        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 bg-brand-yellow hover:bg-[#F3B81F] text-brand-navy px-4 py-2.5 rounded-xl text-xs font-display uppercase tracking-wider font-bold transition-all shadow-xs hover:shadow-sm shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Service</span>
        </Link>
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Search Bar Card */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services by title or material description..."
          className="w-full text-xs sm:text-sm text-brand-navy placeholder:text-gray-400 focus:outline-none bg-transparent font-sans"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-xs text-gray-400 hover:text-gray-600 font-semibold p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Individual Single Service Cards with Grey Border */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 mx-auto flex items-center justify-center border border-gray-200/80 shadow-2xs">
            <Layers className="w-6 h-6 stroke-[1.8]" />
          </div>
          <p className="text-base font-display uppercase font-bold text-brand-navy">No services found</p>
          <p className="text-xs text-gray-500 font-sans">
            {search ? "No results matching your query." : "Click below to add your first roofing service card."}
          </p>
          {!search && (
            <div className="pt-2">
              <Link
                href="/admin/services/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow hover:bg-[#F3B81F] text-brand-navy rounded-xl text-xs font-display uppercase tracking-wider font-bold transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Service</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredServices.map((service, index) => {
            const charCount = service.description.length;
            const isIdealLength = charCount <= 145;

            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs hover:border-gray-300 hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
              >
                {/* Left: Thumbnail + Title & Desc */}
                <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0 flex-1">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0 shadow-2xs">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-[11px] font-mono font-bold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-md border border-gray-200">
                        {service.number || String(index + 1).padStart(2, "0")}
                      </span>
                      <Link
                        href={`/admin/services/${service.id}/edit`}
                        className="text-base sm:text-lg font-bold text-brand-navy hover:text-brand-yellow-hover transition-colors truncate font-sans"
                      >
                        {service.title}
                      </Link>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed font-sans">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                      <span
                        className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md border border-gray-200 ${isIdealLength
                            ? "bg-emerald-50 text-emerald-800"
                            : "bg-amber-50 text-amber-800"
                          }`}
                      >
                        {charCount} / 160 chars
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        ID: {service.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 w-full md:w-auto justify-end">
                  <Link
                    href={`/admin/services/${service.id}/edit`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-display uppercase tracking-wider font-bold text-gray-700 hover:text-brand-navy hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-2xs"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Service</span>
                  </Link>

                  <button
                    onClick={() => setDeletingService(service)}
                    className="p-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal Card */}
      {deletingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-display uppercase font-bold text-brand-navy text-base">
                  Delete Service Card
                </h3>
                <p className="text-xs text-gray-500 font-sans">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
              Are you sure you want to delete{" "}
              <strong className="text-brand-navy font-bold">
                &ldquo;{deletingService.title}&rdquo;
              </strong>
              ? This service card will be removed from the homepage sticky deck and public services catalogue.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 font-display uppercase tracking-wider text-xs font-bold">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingService(null)}
                disabled={isDeleting}
                className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white border-red-600 rounded-xl"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
