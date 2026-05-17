"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCan } from "@/hooks/useCan";
import { Fase } from "@/features/partidos/types/types";
import AccessDenied403Page from "@/app/(dashboard)/403/page";

const reglaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  partidoNumero: z
    .union([z.string(), z.number()])
    .transform((value) => Number(value))
    .refine((value) => !Number.isNaN(value) && value > 0, {
      message: "El número de partido es requerido",
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
      message: "El orden debe ser un número válido",
    }),
});

type ReglaFormInput = z.input<typeof reglaSchema>;
type ReglaFormData = z.output<typeof reglaSchema>;

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
    loadData();
  }, [canCrear]);

  const loadData = async () => {
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
  };

  const onSubmit = async (data: ReglaFormData) => {
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
  };

  if (cargandoData) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!canCrear) {
    return <AccessDenied403Page />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="rounded-2xl" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>

      <Card className="border-white/70 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
          <div className="space-y-2">
            <CardTitle className="text-2xl text-slate-950">Crear regla de cruces</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Configurá posiciones, fase y programación para que el sistema pueda armar los cruces.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-5 md:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField control={form.control} name="nombre" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del partido</FormLabel>
                    <FormControl><Input placeholder="Partido 73 - 2º Grupo A vs 2º Grupo B" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="partidoNumero" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de partido</FormLabel>
                    <FormControl><Input type="number" min={1} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="faseId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fase</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Selecciona una fase" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fases.map((fase) => (
                          <SelectItem key={fase.id} value={fase.id.toString()}>{fase.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="orden" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orden</FormLabel>
                    <FormControl><Input type="number" min={0} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField control={form.control} name="localOrigen" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origen local</FormLabel>
                    <FormControl><Input placeholder="2º Grupo A" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="visitanteOrigen" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origen visitante</FormLabel>
                    <FormControl><Input placeholder="2º Grupo B" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField control={form.control} name="estadio" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estadio</FormLabel>
                    <FormControl><Input placeholder="Estadio Los Ángeles" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="hora" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <FormControl><Input type="time" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="fecha" render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn("w-full justify-between rounded-2xl text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP", { locale: es }) : "Selecciona una fecha"}
                            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-2xl bg-[#39A935] font-bold text-white shadow-lg shadow-green-700/20 transition hover:bg-[#247A28]"
                >
                  Guardar regla
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
