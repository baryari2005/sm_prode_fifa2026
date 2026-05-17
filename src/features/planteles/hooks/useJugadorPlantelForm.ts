import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { toast } from "sonner";

import type {
  JugadorSeleccionCreateInput,
  JugadorSeleccionUpdateInput,
} from "@/features/partidos/types/types";
import {
  createJugador,
  updateJugador,
} from "@/features/partidos/services/plantel.service";

import { MAX_PHOTO_BYTES } from "../types/constants";
import {
  buildJugadorPlantelPayload,
  toInitialJugadorPlantelFormState,
} from "../helpers";
import type {
  JugadorPlantelFormField,
  JugadorPlantelFormProps,
} from "../types";

type UploadResponse = {
  publicUrl?: string;
  error?: string;
};

export function useJugadorPlantelForm({
  mode,
  jugador,
  selecciones,
  selectedSeleccionId,
  onSuccess,
}: JugadorPlantelFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [form, setForm] = useState(() =>
    toInitialJugadorPlantelFormState(jugador, selectedSeleccionId)
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isEditMode = mode === "edit";
  const selectedSeleccion =
    selecciones.find((seleccion) => seleccion.id === form.seleccionId) ?? null;

  function updateField(key: JugadorPlantelFormField, value: string) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function uploadPhoto(file?: File | null) {
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Solo JPG o PNG");
      return;
    }

    if (file.size > MAX_PHOTO_BYTES) {
      toast.error("La imagen excede 500KB");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/media/jugadores/upload", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as UploadResponse;

      if (!response.ok || !result.publicUrl) {
        throw new Error(result.error || "Error al subir la imagen");
      }

      updateField("fotoUrl", result.publicUrl);
      toast.success("Imagen subida correctamente");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo subir la imagen");
    } finally {
      setUploading(false);
      setDragActive(false);
    }
  }

  async function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    await uploadPhoto(event.target.files?.[0] ?? null);
    event.target.value = "";
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave() {
    setDragActive(false);
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    await uploadPhoto(event.dataTransfer.files?.[0] ?? null);
  }

  async function handleSubmit() {
    if (!form.seleccionId || !form.nombre.trim()) {
      toast.error("Completá la selección y el nombre del jugador");
      return;
    }

    try {
      setSubmitting(true);

      const payload = buildJugadorPlantelPayload(form);

      if (mode === "create") {
        await createJugador(
          form.seleccionId,
          payload as JugadorSeleccionCreateInput
        );
        toast.success("Jugador creado correctamente");
      } else if (jugador) {
        await updateJugador(jugador.id, payload as JugadorSeleccionUpdateInput);
        toast.success("Jugador actualizado correctamente");
      }

      onSuccess?.(form.seleccionId);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo guardar el jugador");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    form,
    submitting,
    uploading,
    dragActive,
    fileInputRef,
    isEditMode,
    selectedSeleccion,
    updateField,
    handleFileInputChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleSubmit,
  };
}
