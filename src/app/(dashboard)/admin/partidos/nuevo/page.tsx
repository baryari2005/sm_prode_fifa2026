"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCan } from "@/hooks/useCan";
import { Seleccion, Fase } from "@/features/partidos/types/types";
import AccessDenied403Page from "@/app/(dashboard)/403/page";

const partidoSchema = z.object({
  fecha: z.date({
    error: "La fecha es requerida",
  }).refine((date) => date !== undefined, {
    message: "La fecha es requerida",
  }),
  estadio: z.string().optional(),
  ciudad: z.string().optional(),
  faseId: z.string().min(1, "La fase es requerida"),
  seleccionLocalId: z.string().min(1, "La selección local es requerida"),
  seleccionVisitanteId: z.string().min(1, "La selección visitante es requerida"),
});

type PartidoFormData = z.infer<typeof partidoSchema>;

export default function NuevoPartidoPage() {
  const router = useRouter();
  const canCrearPartidos = useCan("partidos", "crear");

  const [selecciones, setSelecciones] = useState<Seleccion[]>([]);
  const [fases, setFases] = useState<Fase[]>([]);
  const [loading, setLoading] = useState(false);
  const [cargandoData, setCargandoData] = useState(true);

  const form = useForm<PartidoFormData>({
    resolver: zodResolver(partidoSchema),
    defaultValues: {
      estadio: "",
      ciudad: "",
    },
  });

  useEffect(() => {
    if (!canCrearPartidos) {
      setCargandoData(false);
      return;
    }

    loadData();
  }, [canCrearPartidos, router]);

  const loadData = async () => {
    try {
      setCargandoData(true);

      const optionsRes = await fetch("/api/partidos", { method: "OPTIONS" });
      if (optionsRes.ok) {
        const optionsData = await optionsRes.json();
        setSelecciones(optionsData.selecciones || []);
        setFases(optionsData.fases || []);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setCargandoData(false);
    }
  };

  const onSubmit = async (data: PartidoFormData) => {
    try {
      setLoading(true);

      const payload = {
        ...data,
        fecha: data.fecha.toISOString(),
        faseId: parseInt(data.faseId),
      };

      const res = await fetch("/api/partidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Partido creado exitosamente");
        router.push("/admin/partidos");
      } else {
        const error = await res.json();
        toast.error(error.message || "Error al crear el partido");
      }
    } catch (error) {
      console.error("Error creando partido:", error);
      toast.error("Error al crear el partido");
    } finally {
      setLoading(false);
    }
  };

  if (cargandoData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!canCrearPartidos) {
    return <AccessDenied403Page />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crear Nuevo Partido</h1>
          <p className="text-muted-foreground">
            Ingresá los detalles del partido
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Partido</CardTitle>
          <CardDescription>
            Completá todos los campos requeridos para crear el partido.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fecha"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha y Hora</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP 'a las' p", { locale: es })
                              ) : (
                                <span>Seleccioná fecha y hora</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date: Date) =>
                              date < new Date("2026-01-01") || date > new Date("2026-12-31")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="faseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fase</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccioná una fase" />
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
                  name="seleccionLocalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selección Local</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccioná selección local" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selecciones.map((seleccion) => (
                            <SelectItem key={seleccion.id} value={seleccion.id}>
                              {seleccion.bandera} {seleccion.nombre}
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
                  name="seleccionVisitanteId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selección Visitante</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccioná selección visitante" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selecciones.map((seleccion) => (
                            <SelectItem key={seleccion.id} value={seleccion.id}>
                              {seleccion.bandera} {seleccion.nombre}
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
                  name="estadio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estadio (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del estadio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ciudad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ciudad del partido" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creando..." : "Crear Partido"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
