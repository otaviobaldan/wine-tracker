"use client";

import { ChangeEvent, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";

interface PhotoUploadProps {
  name: string;
  defaultUrl?: string | null;
}

async function resizeImage(file: File, maxDim = 1600, quality = 0.8): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Failed to encode image"))),
      "image/jpeg",
      quality,
    );
  });
}

export function PhotoUpload({ name, defaultUrl }: PhotoUploadProps) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const resized = await resizeImage(file);
      const res = await fetch(`/api/photos/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: resized,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setUrl(data.url);
    } catch {
      setError("Couldn't upload that photo. Try again.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={url} />
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary Blob URLs, not worth next/image remotePatterns config
        <img src={url} alt="Bottle label" className="mb-2 h-40 w-32 rounded-lg object-cover" />
      ) : null}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-muted hover:bg-surface-hover disabled:opacity-50"
      >
        <ImagePlus size={16} />
        {uploading ? "Uploading…" : url ? "Replace photo" : "Add a photo"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {error && <p className="mt-1 text-xs text-accent">{error}</p>}
    </div>
  );
}
