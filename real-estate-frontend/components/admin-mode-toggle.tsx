"use client";

import { useAdminMode } from "@/lib/admin-mode";

export default function AdminModeToggle() {
  const { isAdmin, setAdminMode } = useAdminMode();

  return (
    <div className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-3 py-2 shadow-sm">
      <div className="hidden text-right sm:block">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
          Admin Mode
        </p>
        <p className="text-xs text-zinc-500">
          {isAdmin ? "Internal notes visible" : "Standard listing view"}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={isAdmin}
        aria-label="Admin Mode"
        onClick={() => setAdminMode(!isAdmin)}
        className={`relative h-6 w-11 rounded-full transition ${
          isAdmin ? "bg-zinc-900" : "bg-zinc-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            isAdmin ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
