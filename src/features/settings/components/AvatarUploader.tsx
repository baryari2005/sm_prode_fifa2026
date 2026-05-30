// src/components/Settings/AvatarUploader.tsx
"use client";

import { useRef, useState, type DragEvent } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getAxiosMessage } from "@/lib/errors/getAxiosErrorMessage";
import { toast } from "sonner";

type Props = {
  currentUrl?: string | null;
  onTempUploaded: (p: { tmpPath: string; publicUrl: string }) => void;
  maxKB?: number;
  minSize?: number;
  maxSide?: number;
  disabled?: boolean;
  fallbackText?: string;
};

type CompressOpts = {
  maxSide: number;
  maxBytes: number;
  minQuality?: number;
  step?: number;
};

const toDataURL = (file: File) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

async function compressToJpeg(
  img: HTMLImageElement,
  { maxSide, maxBytes, minQuality = 0.6, step = 0.05 }: CompressOpts,
): Promise<Blob> {
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);

  let q = 0.9;
  let blob: Blob | null = null;
  while (q >= (minQuality ?? 0.6)) {
    blob = await new Promise<Blob | null>((ok) =>
      canvas.toBlob((b) => ok(b), "image/jpeg", q),
    );
    if (blob && blob.size <= maxBytes) break;
    q -= step ?? 0.05;
  }
  if (!blob) {
    blob = await new Promise<Blob | null>((ok) =>
      canvas.toBlob((b) => ok(b), "image/jpeg", minQuality ?? 0.6),
    );
  }
  return blob!;
}

export function AvatarUploader({
  currentUrl,
  onTempUploaded,
  maxKB = 200,
  minSize = 128,
  maxSide = 512,
  fallbackText = "US",
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | undefined>(currentUrl ?? undefined);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const pick = () => inputRef.current?.click();

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Solo JPG o PNG");
      return;
    }

    setUploading(true);
    try {
      const dataUrl = await toDataURL(file);
      const img = await loadImage(dataUrl);
      if (img.width < minSize || img.height < minSize) {
        toast.error(`Mínimo ${minSize}×${minSize}px`);
        return;
      }

      const blob = await compressToJpeg(img, {
        maxSide,
        maxBytes: maxKB * 1024,
      });
      const uploadFile = new File([blob], "avatar.jpg", { type: "image/jpeg" });

      const fd = new FormData();
      fd.append("file", uploadFile);

      const resp = await fetch("/api/media/avatars/upload", {
        method: "POST",
        body: fd,
      });
      const json = await resp.json();

      if (!resp.ok) throw new Error(json.error || "Error al subir");
      const tmpPath = json.tmpPath ?? json.path;
      setPreview(json.publicUrl);
      onTempUploaded({ tmpPath, publicUrl: json.publicUrl });
      toast.success("Imagen subida");
    } catch (e: unknown) {
      toast.error(getAxiosMessage(e, "Error al subir"));
    } finally {
      setUploading(false);
      setDragActive(false);
    }
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    await handleFile(file);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border border-[#5993B6]/24 bg-[#10233B] shadow-[0_16px_36px_rgba(2,6,23,0.22)]">
          <AvatarImage src={preview} />
          <AvatarFallback className="bg-[#10233B] text-sm font-black tracking-[0.16em] text-[#EAF8FF]">
            {fallbackText}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <div className="text-sm font-semibold text-white">Cambiar avatar</div>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <Button
              type="button"
              variant="secondary"
              className="h-11 rounded-2xl border border-[#5993B6]/24 bg-white/[0.08] px-4 text-white shadow-none hover:bg-white/[0.12]"
              onClick={pick}
              disabled={uploading}
            >
              {uploading ? "Subiendo..." : "Seleccionar imagen"}
            </Button>
          </div>
          <div className="text-xs text-white/58">
            JPG/PNG • máx. {maxKB}KB • mín. {minSize}×{minSize}px
          </div>
        </div>
      </div>

      <div
        className={`cursor-pointer rounded-[24px] border-2 border-dashed p-4 text-center transition ${
          dragActive
            ? "border-[#5993B6] bg-[#5993B6]/12"
            : "border-white/14 bg-[#091829]/72"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <p className="text-sm font-semibold text-white">
          Arrastrá y soltá una imagen aquí para cambiar tu avatar
        </p>
        <p className="text-xs text-white/58">
          También podés usar el botón de seleccionar imagen.
        </p>
      </div>
    </div>
  );
}
