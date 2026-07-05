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
      <h1 className="font-display text-xl text-foreground">Não foi possível conectar ao servidor</h1>
      <p className="max-w-xs text-sm text-muted">
        O backend pode estar inicializando ou momentaneamente indisponível. Tente novamente em instantes.
      </p>
      <Button onClick={() => unstable_retry()}>Tentar novamente</Button>
    </div>
  );
}
