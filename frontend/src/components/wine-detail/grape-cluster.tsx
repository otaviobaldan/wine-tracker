interface GrapeClusterSvgProps {
  color: string;
  size: number;
}

function GrapeClusterSvg({ color, size }: GrapeClusterSvgProps) {
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

interface GrapeClusterProps {
  fill: 0 | 0.5 | 1;
  size?: number;
}

// A small cluster of grapes, drawn as circles so it reads at a glance next to
// Lucide's stroke-based icons without relying on emoji (renders inconsistently
// across OSes). Half-fill is done with a CSS clip-path (not an SVG <clipPath>
// element, which would need a page-unique id — this renders many times per
// page in list/grid views) overlaying a filled copy on the empty one.
export function GrapeCluster({ fill, size = 16 }: GrapeClusterProps) {
  return (
    <span className="relative inline-block" style={{ width: size, height: size }}>
      <GrapeClusterSvg color="var(--color-border)" size={size} />
      {fill > 0 && (
        <span
          className="absolute inset-0"
          style={fill === 0.5 ? { clipPath: "inset(0 50% 0 0)" } : undefined}
        >
          <GrapeClusterSvg color="var(--color-accent)" size={size} />
        </span>
      )}
    </span>
  );
}

interface ScoreDisplayProps {
  score: number;
  size?: number;
}

export function ScoreDisplay({ score, size = 16 }: ScoreDisplayProps) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`Nota: ${score} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = score >= n ? 1 : score >= n - 0.5 ? 0.5 : 0;
        return <GrapeCluster key={n} fill={fill} size={size} />;
      })}
    </div>
  );
}
