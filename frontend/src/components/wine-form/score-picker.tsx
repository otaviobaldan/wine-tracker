"use client";

import { useState } from "react";
import { GrapeCluster } from "@/components/wine-detail/grape-cluster";

export function ScorePicker({ defaultValue = 3 }: { defaultValue?: number }) {
  const [score, setScore] = useState(defaultValue);

  return (
    <div className="flex items-center gap-2">
      <input type="hidden" name="score" value={score} />
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => setScore(n)}
          aria-label={`${n} grapes`}
          className="p-1"
        >
          <GrapeCluster filled={n <= score} size={26} />
        </button>
      ))}
    </div>
  );
}
