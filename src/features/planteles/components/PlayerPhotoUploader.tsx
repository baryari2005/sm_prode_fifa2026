import type {
  ChangeEvent,
  DragEvent,
  RefObject,
} from "react";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlayerJerseyAvatar } from "@/features/partidos/components/detalle/lineups/PlayerJerseyAvatar";

import {
  preventMouseSelectionReset,
  selectAllInputText,
} from "../helpers";
import type {
  JugadorPlantelFormField,
  JugadorPlantelFormState,
} from "../types";
import { FormField, FormLabel } from "./FormFields";

type Props = {
  form: JugadorPlantelFormState;
  uploading: boolean;
  dragActive: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  updateField: (key: JugadorPlantelFormField, value: string) => void;
  onFileInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
};

export function PlayerPhotoUploader({
  form,
  uploading,
  dragActive,
  fileInputRef,
  updateField,
  onFileInputChange,
  onDragOver,
  onDragLeave,
  onDrop,
}: Props) {
  return (
    <FormField>
      <FormLabel>Foto del jugador</FormLabel>

      <div
        className={`rounded-2xl border border-dashed bg-white p-4 transition ${
          dragActive ? "border-green-500 bg-green-50/60" : "border-slate-300"
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="mb-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700">
              Arrastrá y soltá una imagen o usá una URL.
            </p>
            <p className="text-xs text-slate-500">
              Si cargás una URL, se usará como foto del jugador.
            </p>
          </div>

          <div className="shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={onFileInputChange}
            />

            <Button
              type="button"
              variant="secondary"
              className="rounded-full bg-green-50 text-green-700 hover:bg-green-100"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Subir imagen
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          {form.fotoUrl.trim() ? (
            <Image
              src={form.fotoUrl}
              alt={form.nombre || "Jugador"}
              width={80}
              height={80}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <PlayerJerseyAvatar
              teamName={form.nombre || "Jugador"}
              number={form.numero.trim() ? Number(form.numero) : null}
              className="h-20 w-20 rounded-2xl"
            />
          )}
        </div>

        <Input
          value={form.fotoUrl}
          onChange={(event) => updateField("fotoUrl", event.target.value)}
          onFocus={selectAllInputText}
          onMouseUp={preventMouseSelectionReset}
          placeholder="Ej: https://... o URL de imagen"
          className="h-11 rounded-2xl border-slate-200 bg-white"
        />
      </div>
    </FormField>
  );
}
