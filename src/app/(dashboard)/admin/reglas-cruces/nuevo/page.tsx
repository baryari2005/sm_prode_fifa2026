"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, CalendarIcon, CalendarRange, Network, Save, ShieldPlus } from "lucide-react";
import { toast } from "sonner";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import { Fase } from "@/features/partidos/types/types";
import { useCan } from "@/hooks/useCan";
import { cn } from "@/lib/utils";

const reglaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  partidoNumero: z
    .union([z.string(), z.number()])
    .transform((value) => Number(value))
    .refine((value) => !Number.isNaN(value) && value > 0, {
      message: "El numero de partido es requerido",
    }),
  faseId: z.string().min(1, "La fase es requerida"),
  localOrigen: z.string().min(1, "El origen local es requerido"),
  visitanteOrigen: z.string().min(1, "El origen visitante es requerido"),
  estadio: z.string().optional(),
  fecha: z.date().optional(),
  hora: z.string().optional(),
  orden: z
    .union([z.string(), z.number()])
    .optional()
    .transform((value) => {
      if (typeof value === "string" && value.trim() === "") {
        return 0;
      }
      return value ? Number(value) : 0;
    })
    .refine((value) => value === undefined || (!Number.isNaN(value) && value >= 0), {
      message: "El orden debe ser un numero valido",
    }),
});

type ReglaFormInput = z.input<typeof reglaSchema>;
type ReglaFormData = z.output<typeof reglaSchema>;

const fieldLabelClassName = "text-white";
const fieldSectionClassName = `rounded-[24px] border border-white/10 p-4 md:p-5 ${DASHBOARD_SUBCARD}`;

export default function NuevoReglaCrucePage() {
  const router = useRouter();
  const canCrear = useCan("partidos", "crear");

  const [fases, setFases] = useState<Fase[]>([]);
  const [loading, setLoading] = useState(false);
  const [cargandoData, setCargandoData] = useState(true);

  const form = useForm<ReglaFormInput, undefined, ReglaFormData>({
    resolver: zodResolver(reglaSchema),
    defaultValues: {
      nombre: "",
      partidoNumero: 1,
      faseId: "",
      localOrigen: "",
      visitanteOrigen: "",
      estadio: "",
      hora: "",
      orden: 0,
    },
  });

  useEffect(() => {
    if (!canCrear) {
      setCargandoData(false);
      return;
    }

    void loadData();
  }, [canCrear]);

  async function loadData() {
    try {
      setCargandoData(true);

      const res = await fetch("/api/partidos", { method: "OPTIONS" });
      if (!res.ok) {
        throw new Error("Error al cargar fases");
      }

      const data = await res.json();
      setFases(data.fases || []);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar las fases");
    } finally {
      setCargandoData(false);
    }
  }

  async function onSubmit(data: ReglaFormData) {
    try {
      setLoading(true);

      const payload = {
        nombre: data.nombre,
        partidoNumero: Number(data.partidoNumero),
        faseId: Number(data.faseId),
        localOrigen: data.localOrigen,
        visitanteOrigen: data.visitanteOrigen,
        estadio: data.estadio || null,
        fecha: data.fecha ? data.fecha.toISOString() : undefined,
        hora: data.hora || null,
        orden: Number(data.orden || 0),
      };

      const res = await fetch("/api/reglas-cruces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.message || "Error al crear la regla");
        return;
      }

      toast.success("Regla creada correctamente");
      router.push("/admin/reglas-cruces");
    } catch (error) {
      console.error(error);
      toast.error("Error al crear la regla");
    } finally {
      setLoading(false);
    }
  }

  if (cargandoData) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (!canCrear) {
    return <AccessDenied403Page />;
  }

  return (
    <div className="space-y-6">
      <section className={`${DASHBOARD_PANEL} rounded-[32px] p-3 md:p-4`}>
        <div className={DASHBOARD_TOP_LINE}>
          <div className={DASHBOARD_TOP_LINE_INNER} />
          <div className={DASHBOARD_TOP_LINE_SWEEP} />
          <div className={DASHBOARD_TOP_LINE_GLOW} />
          <div className={DASHBOARD_TOP_LINE_HAIR} />
        </div>

        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 rounded-[30px] border border-white/10 bg-[#1E2C46] px-4 py-5 text-white md:px-6 md:py-6">
          <div className="space-y-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3]">
              Gestionar fixture
            </div>

            <div className="space-y-2">
              <h1 className="text-[2rem] font-bold leading-[0.98] tracking-[-0.06em] md:text-[2.35rem]">
                Nueva <span className="text-[#5993B6]">regla de cruce</span>
              </h1>
              <p className="font-brand text-[1.8rem] leading-[0.96] tracking-[0.04em] text-white md:text-[2.05rem]">
                Configuracion manual
              </p>
              <p className="max-w-[640px] text-sm leading-6 text-white/74">
                Configura el nombre del partido, origenes, fase y programacion para
                sumar una nueva regla al cuadro del torneo.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className="rounded-full border-white/10 bg-white/10 text-[#AEEBFF] hover:bg-white/10">
                Alta manual
              </Badge>
              <Badge className="rounded-full border-white/10 bg-white/10 text-[#AEEBFF] hover:bg-white/10">
                Cruces
              </Badge>
              <Badge className="rounded-full border-white/10 bg-white/10 text-[#AEEBFF] hover:bg-white/10">
                Fases
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_320px] xl:items-start">
        <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>

          <div className="relative z-10 space-y-5">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                Carga operativa
              </p>
              <h2 className="mt-2 font-brand text-[2rem] leading-[0.92] tracking-[0.04em] text-white">
                Datos de la regla
              </h2>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <section className={fieldSectionClassName}>
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#AEEBFF]">
                      Base del cruce
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={fieldLabelClassName}>Nombre del partido</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Partido 73 - 2do Grupo A vs 2do Grupo B"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="partidoNumero"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={fieldLabelClassName}>Numero de partido</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="faseId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={fieldLabelClassName}>Fase</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecciona una fase" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {fases.map((fase) => (
                                <SelectItem key={fase.id} value={fase.id.toString()}>
                                  {fase.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="orden"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={fieldLabelClassName}>Orden</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                <section className={fieldSectionClassName}>
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#AEEBFF]">
                      Origenes del cruce
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="localOrigen"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={fieldLabelClassName}>Origen local</FormLabel>
                          <FormControl>
                            <Input placeholder="2do Grupo A" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="visitanteOrigen"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={fieldLabelClassName}>Origen visitante</FormLabel>
                          <FormControl>
                            <Input placeholder="2do Grupo B" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                <section className={fieldSectionClassName}>
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#AEEBFF]">
                      Programacion
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="estadio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={fieldLabelClassName}>Estadio</FormLabel>
                          <FormControl>
                            <Input placeholder="Estadio Los Angeles" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hora"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={fieldLabelClassName}>Hora</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fecha"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className={fieldLabelClassName}>Fecha</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-between rounded-xl border-white/10 bg-[rgba(11,39,69,0.78)] text-left font-normal text-white hover:bg-[rgba(18,53,92,0.92)]",
                                    !field.value && "text-white/45",
                                  )}
                                >
                                  {field.value
                                    ? format(field.value, "PPP", { locale: es })
                                    : "Selecciona una fecha"}
                                  <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto border border-white/10 bg-[#10253F] p-0 text-white"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="rounded-2xl bg-[#39A935] font-bold text-white shadow-lg shadow-green-700/20 transition hover:bg-[#247A28]"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? "Guardando..." : "Guardar regla"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </section>

        <aside className="grid gap-4">
          <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
            <div className={DASHBOARD_TOP_LINE}>
              <div className={DASHBOARD_TOP_LINE_INNER} />
              <div className={DASHBOARD_TOP_LINE_SWEEP} />
              <div className={DASHBOARD_TOP_LINE_GLOW} />
              <div className={DASHBOARD_TOP_LINE_HAIR} />
            </div>

            <div className="relative z-10 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#AEEBFF]">
                Resumen rapido
              </p>
              <div className={`rounded-[22px] p-4 ${DASHBOARD_SUBCARD}`}>
                <p className="font-brand text-[1.6rem] leading-none tracking-[0.04em] text-white">
                  {fases.length} fases disponibles
                </p>
                <p className="mt-3 text-sm leading-6 text-white/74">
                  La regla se asocia a una fase existente para que despues el sistema
                  pueda ubicarla correctamente en el cuadro.
                </p>
              </div>
            </div>
          </section>

          <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
            <div className={DASHBOARD_TOP_LINE}>
              <div className={DASHBOARD_TOP_LINE_INNER} />
              <div className={DASHBOARD_TOP_LINE_SWEEP} />
              <div className={DASHBOARD_TOP_LINE_GLOW} />
              <div className={DASHBOARD_TOP_LINE_HAIR} />
            </div>

            <div className="relative z-10 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#AEEBFF]">
                Checklist
              </p>
              <div className={`rounded-[22px] p-4 ${DASHBOARD_SUBCARD}`}>
                <div className="flex items-start gap-3">
                  <ShieldPlus className="mt-0.5 h-4.5 w-4.5 text-[#FFE4A3]" />
                  <p className="text-sm leading-6 text-white/72">
                    Usa una nomenclatura clara para local y visitante, por ejemplo
                    puesto de grupo o ganador de partido previo.
                  </p>
                </div>
              </div>
              <div className={`rounded-[22px] p-4 ${DASHBOARD_SUBCARD}`}>
                <div className="flex items-start gap-3">
                  <CalendarRange className="mt-0.5 h-4.5 w-4.5 text-[#AEEBFF]" />
                  <p className="text-sm leading-6 text-white/72">
                    Fecha y hora son opcionales, pero ayudan a dejar la llave lista para
                    el calendario real.
                  </p>
                </div>
              </div>
              <div className={`rounded-[22px] p-4 ${DASHBOARD_SUBCARD}`}>
                <div className="flex items-start gap-3">
                  <Network className="mt-0.5 h-4.5 w-4.5 text-[#AEEBFF]" />
                  <p className="text-sm leading-6 text-white/72">
                    El orden te sirve para controlar la lectura interna de cada fase.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
