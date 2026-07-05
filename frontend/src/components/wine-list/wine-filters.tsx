"use client";

import { FormEvent, useRef } from "react";
import { Search } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import { WINE_TYPES } from "@/lib/types";

interface WineFiltersProps {
  q?: string;
  type?: string;
  minScore?: string;
}

export function WineFilters({ q, type, minScore }: WineFiltersProps) {
  const formRef = useRef<HTMLFormElement>(null);

  function submitNow() {
    formRef.current?.requestSubmit();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Let the browser perform a normal GET navigation with the form's fields
    // as the query string — no client-side fetch/state needed for filtering.
    const form = event.currentTarget;
    for (const el of Array.from(form.elements) as HTMLInputElement[]) {
      if (!el.name || el.value === "") el.disabled = true;
    }
  }

  return (
    <form ref={formRef} action="/" method="GET" onSubmit={handleSubmit} className="mb-4 space-y-2">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <Input
          type="search"
          name="q"
          placeholder="Buscar por nome ou vinícola…"
          defaultValue={q}
          className="pl-9"
        />
      </div>
      <div className="flex gap-2">
        <Select name="type" defaultValue={type ?? ""} className="flex-1" onChange={submitNow}>
          <option value="">Qualquer tipo</option>
          {WINE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
        <Select name="minScore" defaultValue={minScore ?? ""} className="flex-1" onChange={submitNow}>
          <option value="">Qualquer nota</option>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n}+ cachos
            </option>
          ))}
        </Select>
      </div>
    </form>
  );
}
