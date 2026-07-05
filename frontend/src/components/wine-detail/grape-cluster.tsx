interface GrapeClusterProps {
  filled: boolean;
  size?: number;
}

// A small cluster of grapes, drawn as circles so it reads at a glance next to
// Lucide's stroke-based icons without relying on emoji (renders inconsistently
// across OSes).
export function GrapeCluster({ filled, size = 16 }: GrapeClusterProps) {
  const color = filled ? "var(--color-accent)" : "var(--color-border)";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="4" r="2.4" fill={color} />
      <circle cx="8" cy="8" r="2.4" fill={color} />
      <circle cx="16" cy="8" r="2.4" fill={color} />
      <circle cx="6" cy="12.5" r="2.4" fill={color} />
      <circle cx="12" cy="12.5" r="2.4" fill={color} />
      <circle cx="18" cy="12.5" r="2.4" fill={color} />
      <circle cx="9" cy="17" r="2.4" fill={color} />
      <circle cx="15" cy="17" r="2.4" fill={color} />
      <circle cx="12" cy="21" r="2.4" fill={color} />
    </svg>
  );
}

interface ScoreDisplayProps {
  score: number;
  size?: number;
}

export function ScoreDisplay({ score, size = 16 }: ScoreDisplayProps) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`Score: ${score} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <GrapeCluster key={n} filled={n <= score} size={size} />
      ))}
    </div>
  );
}
