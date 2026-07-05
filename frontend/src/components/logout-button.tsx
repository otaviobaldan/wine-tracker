"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={pending}
      aria-label="Log out"
      className="rounded-lg p-2 text-muted hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
    >
      <LogOut size={18} />
    </button>
  );
}
