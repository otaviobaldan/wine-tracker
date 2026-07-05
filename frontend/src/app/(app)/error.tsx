"use client";

import { useEffect } from "react";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <WifiOff size={28} className="text-muted" />
      <h1 className="font-display text-xl text-foreground">Can&apos;t reach the server</h1>
      <p className="max-w-xs text-sm text-muted">
        The backend might be waking up or briefly unavailable. Try again in a moment.
      </p>
      <Button onClick={() => unstable_retry()}>Try again</Button>
    </div>
  );
}
