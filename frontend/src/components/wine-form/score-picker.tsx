"use client";

import { useState } from "react";
import { GrapeCluster } from "@/components/wine-detail/grape-cluster";

const SIZE = 32;

export function ScorePicker({ defaultValue = 3 }: { defaultValue?: number }) {
  const [score, setScore] = useState(defaultValue);

  return (
    <div className="flex items-center gap-2">
      <input type="hidden" name="score" value={score} />
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = score >= n ? 1 : score >= n - 0.5 ? 0.5 : 0;
        return (
          <div key={n} className="relative" style={{ width: SIZE, height: SIZE }}>
            <GrapeCluster fill={fill} size={SIZE} />
            <button
              type="button"
              onClick={() => setScore(n - 0.5)}
              aria-label={`${n - 0.5} cachos de uva`}
              className="absolute inset-y-0 left-0 w-1/2"
            />
            <button
              type="button"
              onClick={() => setScore(n)}
              aria-label={`${n} cachos de uva`}
              className="absolute inset-y-0 right-0 w-1/2"
            />
          </div>
        );
      })}
    </div>
  );
}
