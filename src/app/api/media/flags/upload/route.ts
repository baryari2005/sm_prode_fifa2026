import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/api/_supabase/server";
import crypto from "node:crypto";

export const runtime = "nodejs";

const MAX_BYTES = 500 * 1024; // 500 KB
const BUCKET = "files";
const FOLDER = "banderas";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
  }

  if (!["image/jpeg", "image/png"].includes(file.type)) {
    return NextResponse.json({ error: "Solo JPG o PNG" }, { status: 415 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Archivo excede 500KB" }, { status: 413 });
  }

  const ext = file.type === "image/png" ? "png" : "jpg";
  const filename = `${crypto.randomUUID()}.${ext}`;
  const path = `${FOLDER}/${filename}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    console.error("[media/flags/upload] supabase upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ publicUrl: data.publicUrl, path });
}
