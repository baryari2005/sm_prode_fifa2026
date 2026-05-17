// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { ArrowLeft, Download, Plus, Users } from "lucide-react";
// import { toast } from "sonner";

// import { axiosInstance } from "@/lib/axios";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import type { JugadorSeleccion } from "@/features/partidos/types/types";
// import {
//   deleteJugador,
//   getPlantelBySeleccion,
//   importPlantel,
//   importPlantelDesdeApi,
// } from "@/features/partidos/services/plantel.service";
// import {
//   mapRowsToPlantel,
//   parseImportFile,
// } from "@/features/partidos/services/fixture-import.service";
// import Loading from "@/app/(dashboard)/loading";
// import { PlantelList } from "./PlantelList";

// type SeleccionResumen = {
//   id: string;
//   nombre: string;
//   footballDataTeamId?: number | null;
// };

// type PaginatedResponse = {
//   data?: SeleccionResumen[];
// };

// export function PlantelManager({
//   initialSeleccionId,
//   standalone = false,
// }: {
//   initialSeleccionId?: string;
//   standalone?: boolean;
// }) {
//   const router = useRouter();
//   const [selecciones, setSelecciones] = useState<SeleccionResumen[]>([]);
//   const [selectedSeleccionId, setSelectedSeleccionId] = useState(
//     initialSeleccionId ?? ""
//   );
//   const [jugadores, setJugadores] = useState<JugadorSeleccion[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshToken, setRefreshToken] = useState(0);
//   const [importing, setImporting] = useState(false);
//   const [importingApi, setImportingApi] = useState(false);
//   const [importingAllApi, setImportingAllApi] = useState(false);

//   useEffect(() => {
//     const loadSelecciones = async () => {
//       try {
//         setLoading(true);
//         const response = await axiosInstance.get<PaginatedResponse>(
//           "/paises?page=1&pageSize=200&sortBy=nombre&sortDir=asc"
//         );
//         const items = response.data.data ?? [];
//         setSelecciones(items);

//         const targetId = initialSeleccionId ?? items[0]?.id ?? "";
//         setSelectedSeleccionId(targetId);

//         if (targetId) {
//           const plantel = await getPlantelBySeleccion(targetId);
//           setJugadores(plantel);
//         } else {
//           setJugadores([]);
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("No se pudieron cargar las selecciones");
//       } finally {
//         setLoading(false);
//       }
//     };

//     void loadSelecciones();
//   }, [initialSeleccionId]);

//   useEffect(() => {
//     const loadPlantel = async () => {
//       if (!selectedSeleccionId) {
//         setJugadores([]);
//         return;
//       }

//       try {
//         setLoading(true);
//         const plantel = await getPlantelBySeleccion(selectedSeleccionId);
//         setJugadores(plantel);
//       } catch (error) {
//         console.error(error);
//         toast.error("No se pudo cargar el plantel");
//       } finally {
//         setLoading(false);
//       }
//     };

//     void loadPlantel();
//   }, [selectedSeleccionId]);

//   const selectedSeleccion =
//     selecciones.find((item) => item.id === selectedSeleccionId) ?? null;

//   const totalJugadores = jugadores.length;
//   const totalArqueros = jugadores.filter(
//     (player) => player.posicion === "A"
//   ).length;
//   const totalCampo = totalJugadores - totalArqueros;
//   const returnTo = standalone && selectedSeleccionId
//     ? `/admin/paises/${selectedSeleccionId}/plantel`
//     : "/admin/planteles";

//   async function refreshPlantel() {
//     if (!selectedSeleccionId) return;
//     const updatedPlantel = await getPlantelBySeleccion(selectedSeleccionId);
//     setJugadores(updatedPlantel);
//     setRefreshToken((current) => current + 1);
//   }

//   async function handleDelete(playerId: string) {
//     try {
//       await deleteJugador(playerId);
//       toast.success("Jugador eliminado");
//       await refreshPlantel();
//     } catch (error) {
//       console.error(error);
//       toast.error("No se pudo eliminar el jugador");
//     }
//   }

//   async function handleImport(file: File | null) {
//     if (!file || !selectedSeleccionId) return;

//     try {
//       setImporting(true);
//       const rows = await parseImportFile(file);
//       const items = mapRowsToPlantel(rows, selectedSeleccionId);
//       await importPlantel(selectedSeleccionId, items);
//       await refreshPlantel();
//       toast.success(`Se importaron ${items.length} jugadores`);
//     } catch (error) {
//       console.error(error);
//       toast.error("No se pudo importar el archivo");
//     } finally {
//       setImporting(false);
//     }
//   }

//   async function handleImportFromApi() {
//     if (!selectedSeleccionId) return;

//     try {
//       setImportingApi(true);
//       const created = await importPlantelDesdeApi(selectedSeleccionId);
//       await refreshPlantel();
//       toast.success(`Se importaron ${created.length} jugadores desde la API`);
//     } catch (error) {
//       console.error(error);
//       toast.error("No se pudo importar el plantel desde la API");
//     } finally {
//       setImportingApi(false);
//     }
//   }

//   async function handleImportAllFromApi() {
//     try {
//       setImportingAllApi(true);
//       const response = await axiosInstance.post<{
//         message?: string;
//       }>("/planteles/import-api");
//       toast.success(response.data.message || "Planteles importados desde la API");
//       if (selectedSeleccionId) {
//         await refreshPlantel();
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("No se pudieron importar los planteles de todas las selecciones");
//     } finally {
//       setImportingAllApi(false);
//     }
//   }

//   if (loading && selecciones.length === 0) {
//     return <Loading />;
//   }

//   return (
//     <div className="grid gap-6">
//       <Card className="border-white/70 bg-white shadow-sm">
//         <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
//           <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//             <div className="min-w-0 space-y-2">
//               {standalone && (
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => router.push("/admin/paises")}
//                 >
//                   <ArrowLeft className="mr-2 h-4 w-4" />
//                   Volver
//                 </Button>
//               )}

//               <CardTitle className="flex items-center gap-2 text-2xl">
//                 <Users className="h-6 w-6" />
//                 {standalone
//                   ? `Plantel de ${selectedSeleccion?.nombre ?? "la seleccion"}`
//                   : "Administrar Planteles"}
//               </CardTitle>

//               <CardDescription className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
//                 <span>
//                   Gestiona jugadores por seleccion, importa planteles y mantene
//                   las estadisticas listas para fixture y alineaciones.
//                 </span>
//                 {selectedSeleccion ? (
//                   <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
//                     {selectedSeleccion.nombre}
//                   </span>
//                 ) : null}
//               </CardDescription>
//             </div>

//             <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:flex-wrap xl:items-center xl:justify-end">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => void handleImportAllFromApi()}
//                 disabled={importingAllApi}
//                 className="h-11 rounded-2xl border-slate-200 bg-white"
//               >
//                 <Download className="mr-2 h-4 w-4" />
//                 {importingAllApi
//                   ? "Importando todas..."
//                   : "Importar todos los planteles"}
//               </Button>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => void handleImportFromApi()}
//                 disabled={importingApi || !selectedSeleccionId}
//                 className="h-11 rounded-2xl border-slate-200 bg-white"
//               >
//                 <Download className="mr-2 h-4 w-4" />
//                 {importingApi ? "Importando API..." : "Importar desde API"}
//               </Button>
//               <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700">
//                 {importing ? "Importando..." : "Importar Excel/JSON"}
//                 <input
//                   type="file"
//                   className="hidden"
//                   accept=".json,.xlsx,.xls,.csv"
//                   onChange={(event) =>
//                     void handleImport(event.target.files?.[0] ?? null)
//                   }
//                 />
//               </label>
//               <Button
//                 onClick={() =>
//                   router.push(
//                     `/admin/planteles/nuevo?seleccionId=${selectedSeleccionId}&returnTo=${encodeURIComponent(returnTo)}`
//                   )
//                 }
//                 disabled={!selectedSeleccionId}
//                 className="h-11 rounded-2xl bg-[#39A935] font-bold text-white shadow-lg shadow-green-700/20 transition hover:bg-[#247A28]"
//               >
//                 <Plus className="mr-2 h-4 w-4" />
//                 Nuevo jugador
//               </Button>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="space-y-6 p-5 md:p-6">
//           <div className="grid gap-4 md:grid-cols-[minmax(0,320px)_1fr]">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Seleccion</label>
//               <Select
//                 value={selectedSeleccionId}
//                 onValueChange={setSelectedSeleccionId}
//               >
//                 <SelectTrigger className="h-11 rounded-2xl border-slate-200">
//                   <SelectValue placeholder="Selecciona una seleccion" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {selecciones.map((seleccion) => (
//                     <SelectItem key={seleccion.id} value={seleccion.id}>
//                       {seleccion.nombre}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <SummaryCard
//               title="Seleccion activa"
//               value={selectedSeleccion?.nombre ?? "Sin seleccionar"}
//               // detail={`teamId API: ${selectedSeleccion?.footballDataTeamId ?? "-"}`}
//               detail={`Jugadores en plantel: ${totalJugadores}`}
//             />
//           </div>

//           {/* <div className="grid gap-3 md:grid-cols-3">
//             <SummaryCard
//               title="Jugadores"
//               value={String(totalJugadores)}
//               detail="Plantel cargado"
//             />
//             <SummaryCard
//               title="Arqueros"
//               value={String(totalArqueros)}
//               detail="Posicion A"
//             />
//             <SummaryCard
//               title="Jugadores de campo"
//               value={String(totalCampo)}
//               detail="Resto del plantel"
//             />
//           </div> */}

//           {selectedSeleccionId ? (
//             <PlantelList
//               seleccionId={selectedSeleccionId}
//               refresh={refreshToken}
//               onEdit={(player) =>
//                 router.push(
//                   `/admin/planteles/${player.id}?returnTo=${encodeURIComponent(returnTo)}`
//                 )
//               }
//               onDelete={(playerId) => void handleDelete(playerId)}
//             />
//           ) : null}

//           <div className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-4 shadow-sm">
//             <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-700">
//               Referencias
//             </p>
//             <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600 md:grid-cols-4">
//               <div><span className="font-semibold text-slate-800">AP</span> = Apariciones</div>
//               <div><span className="font-semibold text-slate-800">SUB</span> = Suplencias</div>
//               <div><span className="font-semibold text-slate-800">G</span> = Goles</div>
//               <div><span className="font-semibold text-slate-800">A</span> = Asistencias</div>
//               <div><span className="font-semibold text-slate-800">TT</span> = Tiros totales</div>
//               <div><span className="font-semibold text-slate-800">TM</span> = Tiros al arco</div>
//               <div><span className="font-semibold text-slate-800">FC</span> = Faltas cometidas</div>
//               <div><span className="font-semibold text-slate-800">FS</span> = Faltas sufridas</div>
//               <div><span className="font-semibold text-slate-800">TA</span> = Tarjetas amarillas</div>
//               <div><span className="font-semibold text-slate-800">TR</span> = Tarjetas rojas</div>
//               <div><span className="font-semibold text-slate-800">A</span> = Atajadas</div>
//               <div><span className="font-semibold text-slate-800">GA</span> = Goles concedidos</div>
//               <div><span className="font-semibold text-slate-800">Est</span> = Estatura</div>
//               <div><span className="font-semibold text-slate-800">P</span> = Peso</div>
//               <div><span className="font-semibold text-slate-800">Pos</span> = Posicion</div>
//               <div><span className="font-semibold text-slate-800">Nac</span> = Nacionalidad</div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// function SummaryCard({
//   title,
//   value,
//   detail,
// }: {
//   title: string;
//   value: string;
//   detail: string;
// }) {
//   return (
//     <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50/60 p-4">
//       <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
//         {title}
//       </p>
//       <p className="mt-2 text-xl font-extrabold tracking-[-0.02em] text-slate-950">
//         {value}
//       </p>
//       <p className="mt-1 text-sm text-slate-500">{detail}</p>
//     </div>
//   );
// }
