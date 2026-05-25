"use client";

import { useCallback, useEffect, useState, type ChangeEvent, type DragEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw, Save, Plus, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FlagImage } from "@/components/ui/flag-image";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { paisCreateSchema, paisUpdateSchema } from "../schemas/paises.schema";
import type { Pais } from "../types/types";
import z from "zod";
import type { Resolver } from "react-hook-form";
import { resolveBanderaSrc } from "@/lib/flags";

type Mode = "create" | "edit";

type PaisFormValues = z.infer<typeof paisCreateSchema | typeof paisUpdateSchema>;

interface PaisFormProps {
  mode: Mode;
  pais?: Pais;
  onSuccess?: (id: string) => void;
}

const MAX_FLAG_BYTES = 500 * 1024; // 500 KB

export function PaisForm({ mode, pais, onSuccess }: PaisFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(pais?.bandera ?? undefined);

  const schema = mode === "create" ? paisCreateSchema : paisUpdateSchema;

  const form = useForm<PaisFormValues>({
    resolver: zodResolver(schema) as Resolver<PaisFormValues>,
    defaultValues: {
      nombre: pais?.nombre ?? "",
      codigo: pais?.codigo ?? "",
      footballDataTeamId: pais?.footballDataTeamId ?? null,
      bandera: pais?.bandera ?? "",
      grupo: pais?.grupo ?? "",
      confederacion: pais?.confederacion ?? "",
    },
  });

  const banderaValue = form.watch("bandera");
  const codigoValue = form.watch("codigo");
  const previewSrc = resolveBanderaSrc(preview, codigoValue);

  useEffect(() => {
    if (typeof banderaValue === "string") {
      setPreview(banderaValue);
    }
  }, [banderaValue]);

  const uploadFlag = useCallback(async (file?: File | null) => {
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Solo JPG o PNG");
      return;
    }

    if (file.size > MAX_FLAG_BYTES) {
      toast.error("La imagen excede 500KB");
      return;
    }

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);

      const response = await fetch("/api/media/flags/upload", {
        method: "POST",
        body: fd,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Error al subir la bandera");
      }

      setPreview(result.publicUrl);
      form.setValue("bandera", result.publicUrl);
      toast.success("Bandera subida correctamente");
    } catch (error: unknown) {
      console.error("Error uploading flag:", error);
      toast.error(
        (error instanceof Error && error.message) || "Error al subir la bandera"
      );
    } finally {
      setUploading(false);
      setDragActive(false);
    }
  }, [form]);

  const handleFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    await uploadFlag(event.target.files?.[0] ?? null);
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    await uploadFlag(file);
  };

  const onSubmit = async (values: PaisFormValues) => {
    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");
      const url = mode === "create" ? "/api/paises" : `/api/paises/${pais?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(
          error.message ||
          `Error al ${mode === "create" ? "crear" : "actualizar"} la selección`
        );
        return;
      }

      const result = await response.json();
      toast.success(
        `Selección ${mode === "create" ? "creada" : "actualizada"} correctamente`
      );
      onSuccess?.(result.id);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al procesar la solicitud");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la selección</FormLabel>
              <FormControl>
                <Input className="h-11 rounded-2xl border-slate-200" placeholder="Ej: Argentina" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="codigo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código ISO</FormLabel>
              <FormControl>
                <Input className="h-11 rounded-2xl border-slate-200" placeholder="Ej: ARG" maxLength={10} {...field} />
              </FormControl>
              <FormDescription>
                Código de 2-3 letras para identificar a la selección
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="footballDataTeamId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Football-data teamId</FormLabel>
              <FormControl>
                <Input
                  className="h-11 rounded-2xl border-slate-200"
                  type="number"
                  min={1}
                  placeholder="Ej: 758"
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value.trim() === ""
                        ? null
                        : Number(event.target.value)
                    )
                  }
                />
              </FormControl>
              <FormDescription>
                Id del equipo en football-data.org para importar planteles desde la API v4.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bandera"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bandera</FormLabel>
              <div
                className={`rounded-2xl border border-dashed p-4 transition ${dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-slate-50/40"
                  }`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">
                      Arrastrá y soltá una imagen o usa el botón para subir.
                    </div>
                    <div className="text-sm text-muted-foreground">
                      JPG/PNG hasta 500KB. Si subís una imagen se guardará en Supabase
                      y se usará como bandera.
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      className="hidden"
                      id="flag-upload"
                      onChange={handleFileInputChange}
                    />
                    <label htmlFor="flag-upload">
                      <Button type="button" variant="secondary" className="h-11 rounded-2xl">
                        {uploading ? (
                          <span className="inline-flex items-center gap-2">
                            <RefreshCw className="animate-spin" size={16} />
                            Subiendo...
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            <UploadCloud className="h-4 w-4" />
                            Subir imagen
                          </span>
                        )}
                      </Button>
                    </label>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {previewSrc ? (
                    <FlagImage
                      bandera={preview}
                      codigo={codigoValue}
                      nombre={form.getValues("nombre") || "Selección"}
                      widthClassName="w-20"
                      heightClassName="h-14"
                      fallbackMode="emoji"
                    />
                  ) : (
                    <div className="flex h-14 w-20 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-muted-foreground">
                      Sin imagen
                    </div>
                  )}
                  <FormControl>
                    <Input
                      placeholder="Ej: 🇦🇷 o URL de imagen"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="grupo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grupo</FormLabel>
              <FormControl>
                <Input className="h-11 rounded-2xl border-slate-200" placeholder="Ej: A, B, C..." {...field} value={field.value ?? ""} />
              </FormControl>
              <FormDescription>
                Grupo en la fase de grupos (opcional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confederacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confederación</FormLabel>
              <FormControl>
                <Input className="h-11 rounded-2xl border-slate-200" placeholder="Ej: CONMEBOL, UEFA, CAF..." {...field} value={field.value ?? ""} />
              </FormControl>
              <FormDescription>
                Confederación deportiva del país (opcional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="h-11 w-full rounded-2xl bg-[#39A935] text-white shadow-lg shadow-green-700/20 transition hover:bg-[#247A28]"
          disabled={submitting || uploading}
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <RefreshCw className="animate-spin" size={18} />
              {mode === "create" ? "Creando..." : "Guardando..."}
            </span>
          ) : mode === "create" ? (
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Crear selección
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Save className="h-4 w-4" />
              Guardar cambios
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
