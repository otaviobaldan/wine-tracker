"use client";

import { FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteWineButton({ action }: { action: () => Promise<void> }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!confirm("Delete this wine? This can't be undone.")) {
      event.preventDefault();
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit}>
      <Button type="submit" variant="danger" className="w-full">
        <Trash2 size={16} />
        Delete
      </Button>
    </form>
  );
}
