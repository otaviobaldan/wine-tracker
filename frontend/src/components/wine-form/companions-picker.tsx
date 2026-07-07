"use client";

import { FocusEvent, KeyboardEvent, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { RegisteredUser } from "@/lib/types";

interface CompanionsPickerProps {
  name: string;
  registeredUsers: RegisteredUser[];
  defaultValue?: string[];
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function CompanionsPicker({ name, registeredUsers, defaultValue = [] }: CompanionsPickerProps) {
  const [selected, setSelected] = useState<string[]>(defaultValue);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const trimmedQuery = query.trim();
  const filteredUsers = registeredUsers.filter(
    (u) =>
      !selected.some((s) => normalize(s) === normalize(u.displayName)) &&
      (trimmedQuery === "" || u.displayName.toLowerCase().includes(trimmedQuery.toLowerCase())),
  );
  const canAddFreeText =
    trimmedQuery !== "" &&
    !registeredUsers.some((u) => normalize(u.displayName) === normalize(trimmedQuery)) &&
    !selected.some((s) => normalize(s) === normalize(trimmedQuery));

  function add(candidate: string) {
    const value = candidate.trim();
    if (!value) return;
    if (selected.some((s) => normalize(s) === normalize(value))) return;
    setSelected([...selected, value]);
    setQuery("");
  }

  function remove(value: string) {
    setSelected(selected.filter((s) => s !== value));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (canAddFreeText) add(trimmedQuery);
    }
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!containerRef.current?.contains(event.relatedTarget as Node)) {
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative" onBlur={handleBlur}>
      <input type="hidden" name={name} value={JSON.stringify(selected)} />

      {selected.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {selected.map((s) => (
            <span
              key={s}
              className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-sm text-foreground"
            >
              {s}
              <button
                type="button"
                onClick={() => remove(s)}
                aria-label={`Remover ${s}`}
                className="text-muted hover:text-foreground"
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      )}

      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Buscar pessoa ou digitar um nome…"
      />

      {isOpen && (filteredUsers.length > 0 || canAddFreeText) && (
        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
          {filteredUsers.map((u) => (
            <button
              key={u.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => add(u.displayName)}
              className="block w-full px-3 py-2 text-left text-sm text-foreground hover:bg-surface-hover"
            >
              {u.displayName}
            </button>
          ))}
          {canAddFreeText && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => add(trimmedQuery)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-accent hover:bg-surface-hover"
            >
              <Plus size={14} />
              Adicionar &quot;{trimmedQuery}&quot;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
