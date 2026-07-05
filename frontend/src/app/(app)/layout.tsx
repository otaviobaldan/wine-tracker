import Link from "next/link";
import { Wine } from "lucide-react";
import { requireSession } from "@/lib/session";
import { LogoutButton } from "@/components/logout-button";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireSession();

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <Link href="/" className="flex items-center gap-2">
          <Wine size={20} className="text-accent" />
          <span className="font-display text-lg text-foreground">Wine Tracker</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">{user.displayName}</span>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
    </div>
  );
}
