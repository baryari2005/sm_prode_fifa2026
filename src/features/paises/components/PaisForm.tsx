"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RefreshCw, Save, UploadCloud } from "lucide-react";
import type { Resolver } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { FlagImage } from "@/components/ui/flag-image";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DASHBOARD_SUBCARD } from "@/features/dashboard/components/home/dashboard-home.styles";
import { resolveBanderaSrc } from "@/lib/flags";

import { paisCreateSchema, paisUpdateSchema } from "../schemas/paises.schema";
import type { Pais } from "../types/types";

type Mode = "create" | "edit";
type Variant = "default" | "dashboard";
type PaisFormValues = z.infer<typeof paisCreateSchema | typeof paisUpdateSchema>;

interface PaisFormProps {
  mode: Mode;
  pais?: Pais;
  onSuccess?: (id: string) => void;
  variant?: Variant;
}

const MAX_FLAG_BYTES = 500 * 1024;

export function PaisForm({
  mode,
  pais,
  onSuccess,
  variant = "default",
}: PaisFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(
    pais?.bandera ?? undefined,
  );

  const isDashboardVariant = variant === "dashboard";
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

  const fieldCardClassName = isDashboardVariant
    ? `rounded-[28px] p-4 ${DASHBOARD_SUBCARD}`
    : "";
  const formLayoutClassName = isDashboardVariant
    ? "grid gap-4 md:grid-cols-2"
    : "space-y-6";
  const inputClassName = isDashboardVariant
    ? "h-11 rounded-2xl border-white/10 bg-white/8 text-white placeholder:text-white/38"
    : "h-11 rounded-2xl border-slate-200";
  const labelClassName = isDashboardVariant ? "text-white" : "";
  const descriptionClassName = isDashboardVariant ? "text-white/58" : "";
  const uploadWrapperClassName = isDashboardVariant
    ? dragActive
      ? "border-[#5993B6] bg-[#5993B6]/10"
      : "border-white/12 bg-white/6"
    : dragActive
      ? "border-blue-500 bg-blue-50"
      : "border-slate-200 bg-slate-50/40";
  const secondaryButtonClassName = isDashboardVariant
    ? "h-11 rounded-2xl border-white/12 bg-white/10 text-white hover:bg-white/15 hover:text-white"
    : "h-11 rounded-2xl";
  const submitButtonClassName = isDashboardVariant
    ? "h-11 w-full rounded-2xl bg-[#FAB438] text-[#1E2C46] shadow-lg shadow-[#FAB438]/20 transition hover:bg-[#F7C45A] md:col-span-2"
    : "h-11 w-full rounded-2xl bg-[#39A935] text-white shadow-lg shadow-green-700/20 transition hover:bg-[#247A28]";

  useEffect(() => {
    if (typeof banderaValue === "string") {
      setPreview(banderaValue);
    }
  }, [banderaValue]);

  const uploadFlag = useCallback(
    async (file?: File | null) => {
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
          (error instanceof Error && error.message) ||
            "Error al subir la bandera",
        );
      } finally {
        setUploading(false);
        setDragActive(false);
      }
    },
    [form],
  );

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
            `Error al ${mode === "create" ? "crear" : "actualizar"} la selección`,
        );
        return;
      }

      const result = await response.json();
      toast.success(
        `Selección ${mode === "create" ? "creada" : "actualizada"} correctamente`,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className={formLayoutClassName}>
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem className={fieldCardClassName}>
              <FormLabel className={labelClassName}>Nombre de la selección</FormLabel>
              <FormControl>
                <Input className={inputClassName} placeholder="Ej: Argentina" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="codigo"
          render={({ field }) => (
            <FormItem className={fieldCardClassName}>
              <FormLabel className={labelClassName}>Código ISO</FormLabel>
              <FormControl>
                <Input
                  className={inputClassName}
                  placeholder="Ej: ARG"
                  maxLength={10}
                  {...field}
                />
              </FormControl>
              <FormDescription className={descriptionClassName}>
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
            <FormItem className={fieldCardClassName}>
              <FormLabel className={labelClassName}>Football-data teamId</FormLabel>
              <FormControl>
                <Input
                  className={inputClassName}
                  type="number"
                  min={1}
                  placeholder="Ej: 758"
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value.trim() === ""
                        ? null
                        : Number(event.target.value),
                    )
                  }
                />
              </FormControl>
              <FormDescription className={descriptionClassName}>
                Id del equipo en football-data.org para importar planteles desde la API v4.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="grupo"
          render={({ field }) => (
            <FormItem className={fieldCardClassName}>
              <FormLabel className={labelClassName}>Grupo</FormLabel>
              <FormControl>
                <Input
                  className={inputClassName}
                  placeholder="Ej: A, B, C..."
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormDescription className={descriptionClassName}>
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
            <FormItem className={fieldCardClassName}>
              <FormLabel className={labelClassName}>Confederación</FormLabel>
              <FormControl>
                <Input
                  className={inputClassName}
                  placeholder="Ej: CONMEBOL, UEFA, CAF..."
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormDescription className={descriptionClassName}>
                Confederación deportiva del país (opcional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bandera"
          render={({ field }) => (
            <FormItem className={isDashboardVariant ? "md:col-span-2" : ""}>
              <div className={fieldCardClassName}>
                <FormLabel className={labelClassName}>Bandera</FormLabel>
                <div
                  className={`rounded-2xl border border-dashed p-4 transition ${uploadWrapperClassName}`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className={`text-sm font-medium ${isDashboardVariant ? "text-white" : ""}`}>
                        Arrastrá y soltá una imagen o usa el botón para subir.
                      </div>
                      <div className={`text-sm ${isDashboardVariant ? "text-white/58" : "text-muted-foreground"}`}>
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
                        <Button
                          type="button"
                          variant={isDashboardVariant ? "outline" : "secondary"}
                          className={secondaryButtonClassName}
                        >
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
                      <div
                        className={`flex h-14 w-20 items-center justify-center rounded-2xl border border-dashed text-sm ${
                          isDashboardVariant
                            ? "border-white/12 text-white/58"
                            : "border-slate-200 text-muted-foreground"
                        }`}
                      >
                        Sin imagen
                      </div>
                    )}
                    <FormControl>
                      <Input
                        className={inputClassName}
                        placeholder="Ej: bandera en URL"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                  </div>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className={submitButtonClassName}
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
