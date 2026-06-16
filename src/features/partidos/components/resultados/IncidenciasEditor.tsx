"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { createMatchIncident } from "@/features/partidos/helpers/resultado-incidencias.helpers";
import type {
  IncidentType,
  MatchIncident,
  TeamLineup,
} from "@/features/partidos/types/fixture-details";
import type { JugadorSeleccion } from "@/features/partidos/types/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { SectionCard } from "./common/SectionCard";
import { IncidentTimeline } from "./IncidentTimeline";
import { IncidentTypeTabs } from "./IncidentTypeTabs";
import { IncidentQuickPlayerBatchEditor } from "./incidencias/IncidentQuickPlayerBatchEditor";
import { IncidentQuickSubstitutionEditor } from "./incidencias/IncidentQuickSubstitutionEditor";

type IncidenciasEditorProps = {
  localNombre: string;
  visitanteNombre: string;
  plantelLocal: JugadorSeleccion[];
  plantelVisitante: JugadorSeleccion[];
  alineacionLocal: TeamLineup;
  alineacionVisitante: TeamLineup;
  incidencias: MatchIncident[];
  onChange: (incidencias: MatchIncident[]) => void;
  showTimeline?: boolean;
};

type FormState = {
  minuto: string;
  equipo: "local" | "visitante" | "general";
  jugadorId: string;
  asistidorId: string;
  jugadorSaleId: string;
  jugadorEntraId: string;
  descripcion: string;
  penal: boolean;
  autogol: boolean;
  lesionTipo: string;
  varResultado: string;
};

const initialForm: FormState = {
  minuto: "",
  equipo: "local",
  jugadorId: "",
  asistidorId: "",
  jugadorSaleId: "",
  jugadorEntraId: "",
  descripcion: "",
  penal: false,
  autogol: false,
  lesionTipo: "",
  varResultado: "",
};

const DARK_FIELD =
  "h-11 border-white/10 bg-white/[0.08] text-white shadow-none placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-[#5993B6]/40";

function findPlayerName(players: JugadorSeleccion[], id: string) {
  return players.find((player) => player.id === id)?.nombre ?? null;
}

export function IncidenciasEditor({
  localNombre,
  visitanteNombre,
  plantelLocal,
  plantelVisitante,
  alineacionLocal,
  alineacionVisitante,
  incidencias,
  onChange,
  showTimeline = true,
}: IncidenciasEditorProps) {
  const [tipo, setTipo] = useState<IncidentType>("gol");
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingIncidentId, setEditingIncidentId] = useState<string | null>(
    null
  );

  const availablePlayers = useMemo(() => {
    if (form.equipo === "local") return plantelLocal;
    if (form.equipo === "visitante") return plantelVisitante;
    return [];
  }, [form.equipo, plantelLocal, plantelVisitante]);

  const goalPlayerTeam = useMemo(() => {
    if (tipo !== "gol" || form.equipo === "general") {
      return form.equipo;
    }

    return form.autogol
      ? form.equipo === "local"
        ? "visitante"
        : "local"
      : form.equipo;
  }, [form.autogol, form.equipo, tipo]);

  const goalPlayers = useMemo(() => {
    if (goalPlayerTeam === "local") return plantelLocal;
    if (goalPlayerTeam === "visitante") return plantelVisitante;
    return [];
  }, [goalPlayerTeam, plantelLocal, plantelVisitante]);

  const playersByTeam = {
    local: plantelLocal,
    visitante: plantelVisitante,
  } as const;

  const lineupsByTeam = {
    local: alineacionLocal,
    visitante: alineacionVisitante,
  } as const;

  const canSubmitIncident = useMemo(() => {
    const minute = Number(form.minuto);
    if (!Number.isFinite(minute) || minute < 0 || minute > 130) return false;

    if (tipo === "var") {
      return Boolean(form.varResultado.trim() || form.descripcion.trim());
    }

    if (tipo === "cambio") {
      return Boolean(
        form.jugadorSaleId &&
          form.jugadorEntraId &&
          form.jugadorSaleId !== form.jugadorEntraId
      );
    }

    if (
      tipo === "gol" ||
      tipo === "tarjeta_amarilla" ||
      tipo === "tarjeta_roja" ||
      tipo === "lesion" ||
      tipo === "penal"
    ) {
      if (tipo === "gol" && form.autogol) {
        return true;
      }

      return Boolean(form.jugadorId);
    }

    return true;
  }, [
    form.autogol,
    form.descripcion,
    form.jugadorEntraId,
    form.jugadorId,
    form.jugadorSaleId,
    form.minuto,
    form.varResultado,
    tipo,
  ]);

  function resetForm(nextTeam: FormState["equipo"] = form.equipo) {
    setForm({
      ...initialForm,
      equipo: nextTeam,
    });
    setEditingIncidentId(null);
  }

  function buildIncidentPayload() {
    const minute = Number(form.minuto);
    if (!Number.isFinite(minute)) return null;

    const sourcePlayers =
      form.equipo === "general"
        ? []
        : tipo === "gol"
          ? goalPlayers
          : playersByTeam[form.equipo];

    return {
      tipo,
      minuto: minute,
      equipo: form.equipo,
      jugadorId: form.jugadorId || null,
      jugadorNombre:
        findPlayerName(sourcePlayers, form.jugadorId) ??
        (tipo === "gol" && form.autogol ? "Autogol" : null),
      asistidorId: form.asistidorId || null,
      asistidorNombre: findPlayerName(sourcePlayers, form.asistidorId),
      jugadorSaleId: form.jugadorSaleId || null,
      jugadorSaleNombre: findPlayerName(sourcePlayers, form.jugadorSaleId),
      jugadorEntraId: form.jugadorEntraId || null,
      jugadorEntraNombre: findPlayerName(sourcePlayers, form.jugadorEntraId),
      descripcion: form.descripcion.trim() || null,
      penal: tipo === "gol" ? form.penal : undefined,
      autogol: tipo === "gol" ? form.autogol : undefined,
      varResultado: tipo === "var" ? form.varResultado || null : null,
      lesionTipo: tipo === "lesion" ? form.lesionTipo || null : null,
    } satisfies Omit<MatchIncident, "id" | "createdAt">;
  }

  function persistIncident() {
    if (!canSubmitIncident) {
      toast.error("Completá los campos necesarios para guardar la incidencia");
      return;
    }

    if (
      tipo === "gol" &&
      form.asistidorId &&
      form.asistidorId === form.jugadorId
    ) {
      toast.error("El goleador y el asistidor no pueden ser el mismo jugador");
      return;
    }

    const incidentPayload = buildIncidentPayload();
    if (!incidentPayload) return;

    if (editingIncidentId) {
      onChange(
        incidencias.map((incident) =>
          incident.id === editingIncidentId
            ? { ...incident, ...incidentPayload }
            : incident
        )
      );
    } else {
      onChange([...incidencias, createMatchIncident(incidentPayload)]);
    }

    resetForm(tipo === "var" ? "general" : form.equipo);
  }

  function appendIncidents(nextIncidents: MatchIncident[]) {
    onChange(
      [...incidencias, ...nextIncidents].sort((a, b) => a.minuto - b.minuto),
    );
  }

  function startEditingIncident(id: string) {
    const incident = incidencias.find((entry) => entry.id === id);
    if (!incident) return;

    setEditingIncidentId(id);
    setTipo(incident.tipo);
    setForm({
      minuto: String(incident.minuto),
      equipo: incident.equipo,
      jugadorId: incident.jugadorId ?? "",
      asistidorId: incident.asistidorId ?? "",
      jugadorSaleId: incident.jugadorSaleId ?? "",
      jugadorEntraId: incident.jugadorEntraId ?? "",
      descripcion: incident.descripcion ?? "",
      penal: Boolean(incident.penal),
      autogol: Boolean(incident.autogol),
      lesionTipo: incident.lesionTipo ?? "",
      varResultado: incident.varResultado ?? "",
    });
  }

  function removeIncident(id: string) {
    const shouldRemove =
      typeof window === "undefined"
        ? true
        : window.confirm("¿Querés eliminar esta incidencia?");

    if (!shouldRemove) return;

    onChange(incidencias.filter((incident) => incident.id !== id));
    if (editingIncidentId === id) resetForm();
  }

  const goalTeamLabel =
    form.equipo === "local"
      ? localNombre
      : form.equipo === "visitante"
        ? visitanteNombre
        : "General";
  const usesQuickBatchEditor =
    tipo === "cambio" ||
    tipo === "tarjeta_amarilla" ||
    tipo === "tarjeta_roja" ||
    tipo === "lesion";
  const showSingleIncidentForm = !usesQuickBatchEditor || Boolean(editingIncidentId);

  return (
    <SectionCard
      title="Alta de incidencias"
      description="Elegí el tipo de evento y cargá los datos operativos del partido desde un único flujo."
      headerContent={
        <div className="space-y-3">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
            Incidencias aplicables
          </p>
          <div className="space-y-2">
            <h2 className="font-brand mt-2 text-[2rem] leading-[0.92] tracking-[0.04em] text-white">
              Alta de incidencias
            </h2>
            <p className="max-w-[780px] text-sm leading-6 text-white/72 md:text-[0.95rem]">
              Cargá goles, tarjetas, cambios, lesiones y eventos clave del
              partido desde un flujo rápido, compacto y pensado para
              administración en vivo.
            </p>
            <p className="max-w-[780px] text-sm font-medium leading-6 text-[#FFE3A1] md:text-[0.95rem]">
              Para que las incidencias impacten en el marcador y en los datos
              guardados, después actualizá el resultado del partido.
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="rounded-[26px] border border-white/10 bg-white/[0.035] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] md:p-5">          
          <IncidentTypeTabs
            value={tipo}
            onChange={(value) => {
              setTipo(value);
              resetForm(
                value === "var"
                  ? "general"
                  : form.equipo === "general"
                    ? "local"
                    : form.equipo
              );
            }}
          />

          {usesQuickBatchEditor && !editingIncidentId && form.equipo !== "general" ? (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#AEEBFF]">
                Equipo
              </span>
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    equipo: "local",
                  }))
                }
                className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition ${
                  form.equipo === "local"
                    ? "border-transparent bg-[#5993B6] text-white"
                    : "border-white/12 bg-white/[0.05] text-white/72 hover:bg-white/[0.1]"
                }`}
              >
                {localNombre}
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    equipo: "visitante",
                  }))
                }
                className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition ${
                  form.equipo === "visitante"
                    ? "border-transparent bg-[#5993B6] text-white"
                    : "border-white/12 bg-white/[0.05] text-white/72 hover:bg-white/[0.1]"
                }`}
              >
                {visitanteNombre}
              </button>
            </div>
          ) : null}

          {tipo === "cambio" && form.equipo !== "general" ? (
            <div className="mt-5">
              <IncidentQuickSubstitutionEditor
                teamLabel={form.equipo === "local" ? localNombre : visitanteNombre}
                teamSide={form.equipo}
                lineup={lineupsByTeam[form.equipo]}
                onAddIncidents={appendIncidents}
              />
            </div>
          ) : null}

          {(tipo === "tarjeta_amarilla" ||
            tipo === "tarjeta_roja" ||
            tipo === "lesion") &&
          form.equipo !== "general" ? (
            <div className="mt-5">
              <IncidentQuickPlayerBatchEditor
                tipo={tipo}
                teamLabel={form.equipo === "local" ? localNombre : visitanteNombre}
                teamSide={form.equipo}
                players={availablePlayers}
                onAddIncidents={appendIncidents}
              />
            </div>
          ) : null}

          {showSingleIncidentForm ? (
          <div className="relative mt-5 grid gap-4 rounded-[22px] border border-white/10 bg-white/[0.05] p-4 
          shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] xl:items-stretch">
            <Field label="Minuto" panel>
              <div className="space-y-1">
                <Input
                  value={form.minuto}
                  inputMode="numeric"
                  placeholder="12"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      minuto: event.target.value.replace(/\D/g, ""),
                    }))
                  }
                  className={DARK_FIELD}
                />            
              </div>
            </Field>

            <Field label="Equipo" panel>
              <Select
                value={form.equipo}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    equipo: value as FormState["equipo"],
                    jugadorId: "",
                    asistidorId: "",
                    jugadorSaleId: "",
                    jugadorEntraId: "",
                    autogol: false,
                  }))
                }
                disabled={tipo === "var"}
              >
                <SelectTrigger className={`${DARK_FIELD} w-full text-base`}>
                  <SelectValue placeholder="Equipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">{localNombre}</SelectItem>
                  <SelectItem value="visitante">{visitanteNombre}</SelectItem>
                  {tipo === "var" ? (
                    <SelectItem value="general">General</SelectItem>
                  ) : null}
                </SelectContent>
              </Select>
            </Field>

            {tipo === "gol" && form.equipo !== "general" ? (
              <Field label="Tipo de gol" panel>
                <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.08] px-3 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white/85">Autogol</p>
                      <p className="text-xs text-white/52">
                        El gol suma para {goalTeamLabel}, pero el jugador se elige del equipo contrario.
                      </p>
                    </div>
                    <Switch
                      checked={form.autogol}
                      onCheckedChange={(checked) =>
                        setForm((current) => ({
                          ...current,
                          autogol: checked,
                          jugadorId: "",
                          asistidorId: "",
                        }))
                      }
                    />
                  </div>
                </div>
              </Field>
            ) : (
              <div />
            )}

            {(tipo === "gol" ||
              tipo === "tarjeta_amarilla" ||
              tipo === "tarjeta_roja" ||
              tipo === "lesion" ||
              tipo === "penal") &&
            form.equipo !== "general" ? (
              <Field
                label={tipo === "gol" ? "Quién hizo el gol" : "Jugador"}
                panel
              >
                <PlayerSelect
                  players={tipo === "gol" ? goalPlayers : availablePlayers}
                  value={form.jugadorId}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      jugadorId: value,
                    }))
                  }
                />
                {tipo === "gol" ? (
                  <p className="mt-2 text-xs text-white/48">
                    {form.autogol
                      ? `Se muestra el plantel del ${goalPlayerTeam === "local" ? localNombre : visitanteNombre} porque ese equipo convierte el gol en contra.`
                      : `Se muestra el plantel de ${goalPlayerTeam === "local" ? localNombre : visitanteNombre}.`}
                  </p>
                ) : null}
              </Field>
            ) : (
              <div />
            )}

            <div className="flex items-center">
              <div className="flex w-full mt-6 gap-2 xl:w-auto">
                {editingIncidentId ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      resetForm(tipo === "var" ? "general" : form.equipo)
                    }
                    className="h-11 rounded-xl border-white/12 bg-white/[0.05] px-4 text-white hover:bg-white/[0.1] hover:text-white"
                  >
                    Cancelar edición
                  </Button>
                ) : null}
                <Button
                  type="button"
                  onClick={persistIncident}
                  disabled={!canSubmitIncident}
                  className="h-11 flex-1 rounded-xl bg-[#5993B6] px-5 text-white hover:bg-[#4B84A6] disabled:bg-white/10 disabled:text-white/35 xl:w-auto"
                >
                  {editingIncidentId ? "Guardar cambios" : "Agregar incidencia"}
                </Button>
              </div>
            </div>
          </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-[#FAB438]/25 bg-[#FAB438]/10 px-4 py-3 text-sm font-medium text-[#FFE3A1]">
          Las incidencias se agregan al timeline, pero para que impacten el
          marcador y los datos guardados tenés que actualizar el resultado del
          partido.
        </div>

        {showSingleIncidentForm ? (
        <div className="rounded-[26px] border border-white/10 bg-white/[0.035] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] md:p-5">
          <div className="space-y-2">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
              Datos complementarios
            </p>
            <p className="max-w-[780px] text-sm leading-6 text-white/72 md:text-[0.95rem]">
              Completá solo los campos específicos del tipo de incidencia que
              estés registrando.
            </p>
          </div>

          <div className="mt-5 grid gap-4 rounded-[22px] border border-white/10 bg-white/[0.05] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] xl:grid-cols-2">
          {tipo === "gol" && form.equipo !== "general" ? (
            <>
              <Field label="Asistidor" panel>
                <div className="space-y-1">
                  <PlayerSelect
                    players={goalPlayers}
                    value={form.asistidorId}
                    onChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        asistidorId: value,
                      }))
                    }                    
                    placeholder="Sin asistidor"
                  />                  
                  {form.autogol ? (
                    <p className="text-xs text-white/48">
                      El goleador y el asistidor se toman del plantel rival porque fue un gol en contra.
                    </p>
                  ) : null}
                </div>
              </Field>


            
              <Field label="Tipo" panel>
                <label className="flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-3 text-sm font-medium text-white/80">
                  <Input
                    type="checkbox"
                    checked={form.penal}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        penal: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-white/20 accent-[#5993B6]"
                  />
                  Penal
                </label>
              </Field>
              <div className="xl:col-span-2">
                <Field label={`Detalle ${goalTeamLabel}`}>
                  <Textarea
                    value={form.descripcion}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        descripcion: event.target.value,
                      }))
                    }
                    placeholder="Definición cruzada, rebote, cabezazo..."
                    className={`min-h-[88px] ${DARK_FIELD}`}
                  />
                </Field>
              </div>
            </>
          ) : null}

          {tipo === "cambio" && form.equipo !== "general" ? (
            <>
              <Field label="Jugador que sale">
                <PlayerSelect
                  players={availablePlayers}
                  value={form.jugadorSaleId}
                  onChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      jugadorSaleId: value,
                    }))
                  }
                />
              </Field>
              <Field label="Jugador que entra">
                <div className="space-y-1">
                  <PlayerSelect
                    players={availablePlayers}
                    value={form.jugadorEntraId}
                    onChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        jugadorEntraId: value,
                      }))
                    }
                  />
                  <p className="text-xs text-white/48">
                    Deben ser dos jugadores distintos.
                  </p>
                </div>
              </Field>
              <div className="xl:col-span-2">
                <Field label="Descripción">
                  <Textarea
                    value={form.descripcion}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        descripcion: event.target.value,
                      }))
                    }
                    placeholder="Cambio táctico, lesión, ajuste defensivo..."
                    className={`min-h-[88px] ${DARK_FIELD}`}
                  />
                </Field>
              </div>
            </>
          ) : null}

          {(tipo === "tarjeta_amarilla" ||
            tipo === "tarjeta_roja" ||
            tipo === "penal") &&
          form.equipo !== "general" ? (
            <div className="xl:col-span-2">
              <Field label="Descripción">
                <Textarea
                  value={form.descripcion}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      descripcion: event.target.value,
                    }))
                  }
                  placeholder="Falta táctica, mano, último recurso..."
                  className={`min-h-[88px] ${DARK_FIELD}`}
                />
              </Field>
            </div>
          ) : null}

          {tipo === "lesion" && form.equipo !== "general" ? (
            <>
              <Field label="Tipo de lesión">
                <Input
                  value={form.lesionTipo}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      lesionTipo: event.target.value,
                    }))
                  }
                  placeholder="Molestia muscular"
                  className={DARK_FIELD}
                />
              </Field>
              <div className="xl:col-span-2">
                <Field label="Descripción">
                  <Textarea
                    value={form.descripcion}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        descripcion: event.target.value,
                      }))
                    }
                    placeholder="Recibió asistencia médica y salió rengueando..."
                    className={`min-h-[88px] ${DARK_FIELD}`}
                  />
                </Field>
              </div>
            </>
          ) : null}

          {tipo === "var" ? (
            <>
              <Field label="Resultado VAR">
                <Input
                  value={form.varResultado}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      varResultado: event.target.value,
                    }))
                  }
                  placeholder="Gol confirmado"
                  className={DARK_FIELD}
                />
              </Field>
              <div className="xl:col-span-2">
                <Field label="Descripción">
                  <Textarea
                    value={form.descripcion}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        descripcion: event.target.value,
                      }))
                    }
                    placeholder="Revisión por posible offside, mano o penal..."
                    className={`min-h-[88px] ${DARK_FIELD}`}
                  />
                </Field>
              </div>
            </>
          ) : null}
          </div>
        </div>
        ) : null}

        {showTimeline ? (
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
              Timeline de incidencias
            </p>
            <IncidentTimeline
              incidencias={incidencias}
              onEdit={startEditingIncident}
              onRemove={removeIncident}
            />
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}

function Field({
  label,
  children,
  panel = false,
}: {
  label: string;
  children: React.ReactNode;
  panel?: boolean;
}) {
  return (
    <div >
      {panel ? (
        <>
          <div className="pointer-events-none absolute inset-0 
          bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.12),transparent_34%),
          radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_28%)] 
          opacity-0 transition-opacity duration-200 group-hover/field:opacity-100" />
          <div className="relative space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#AEEBFF]">
              {label}
            </label>
            {children}
          </div>
        </>
      ) : (
        <>
          <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#AEEBFF]">
            {label}
          </label>
          {children}
        </>
      )}
    </div>
  );
}

function PlayerSelect({
  players,
  value,
  onChange,
  placeholder = "Seleccioná un jugador",
}: {
  players: JugadorSeleccion[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`h-10 w-full rounded-xl ${DARK_FIELD}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {players.map((player) => (
          <SelectItem key={player.id} value={player.id}>
            {player.nombre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
