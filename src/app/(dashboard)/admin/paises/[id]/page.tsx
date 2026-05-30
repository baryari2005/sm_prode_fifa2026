"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Globe2,
  Info,
  Medal,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import { HeroVisualImage } from "@/components/brand/HeroVisualImage";
import { Button } from "@/components/ui/button";
import { FlagImage } from "@/components/ui/flag-image";
import {
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import DashboardLoading from "@/features/dashboard/components/loading/DashboardLoading";
import { PaisForm } from "@/features/paises/components/PaisForm";
import { getMascotForSeleccion } from "@/features/paises/lib/pais-mascot.helpers";
import type { Pais } from "@/features/paises/types/types";
import { useCan } from "@/hooks/useCan";
import { resolveBanderaSrc } from "@/lib/flags";

function getTitleFlagStyle(pais: Pais, banderaSrc: string | null) {
  const codigo = pais.codigo?.trim().toUpperCase();
  const confederacion = pais.confederacion?.trim().toUpperCase();

  switch (codigo) {
    case "MEX":
      return {
        backgroundImage:
          "linear-gradient(90deg, #0b8f4d 0%, #0b8f4d 33%, #f8fafc 33%, #f8fafc 66%, #cf2e2e 66%, #cf2e2e 100%)",
      };
    case "ITA":
      return {
        backgroundImage:
          "linear-gradient(90deg, #149954 0%, #149954 33%, #f8fafc 33%, #f8fafc 66%, #cf2e2e 66%, #cf2e2e 100%)",
      };
    case "FRA":
      return {
        backgroundImage:
          "linear-gradient(90deg, #1f4db8 0%, #1f4db8 33%, #f8fafc 33%, #f8fafc 66%, #d13333 66%, #d13333 100%)",
      };
    case "ARG":
      return {
        backgroundImage:
          "linear-gradient(180deg, #75cfff 0%, #75cfff 33%, #f8fafc 33%, #f8fafc 66%, #75cfff 66%, #75cfff 100%)",
      };
    case "GER":
      return {
        backgroundImage:
          "linear-gradient(180deg, #111827 0%, #111827 33%, #cf2e2e 33%, #cf2e2e 66%, #f5c542 66%, #f5c542 100%)",
      };
    case "NED":
      return {
        backgroundImage:
          "linear-gradient(180deg, #c94a3d 0%, #c94a3d 33%, #f8fafc 33%, #f8fafc 66%, #2a56b6 66%, #2a56b6 100%)",
      };
    case "COL":
      return {
        backgroundImage:
          "linear-gradient(180deg, #f6c945 0%, #f6c945 50%, #2f6fd6 50%, #2f6fd6 75%, #cf2e2e 75%, #cf2e2e 100%)",
      };
    case "ESP":
      return {
        backgroundImage:
          "linear-gradient(180deg, #b91c1c 0%, #b91c1c 26%, #f4c430 26%, #f4c430 74%, #b91c1c 74%, #b91c1c 100%)",
      };
    case "BIH":
      return {
        backgroundImage:
          "linear-gradient(90deg, #1d4ed8 0%, #1d4ed8 72%, #f4c430 72%, #f4c430 100%)",
      };
    case "KOR":
      return {
        backgroundImage:
          "linear-gradient(90deg, #f8fafc 0%, #f8fafc 38%, #c81e1e 38%, #c81e1e 58%, #1d4ed8 58%, #1d4ed8 78%, #f8fafc 78%, #f8fafc 100%)",
      };
    default:
      switch (confederacion) {
        case "CONMEBOL":
          return {
            backgroundImage:
              "linear-gradient(90deg, #5cc7ff 0%, #f8fafc 50%, #5cc7ff 100%)",
          };
        case "CONCACAF":
          return {
            backgroundImage:
              "linear-gradient(90deg, #0b8f4d 0%, #f8fafc 50%, #cf2e2e 100%)",
          };
        case "UEFA":
          return {
            backgroundImage:
              "linear-gradient(90deg, #1f4db8 0%, #f8fafc 50%, #d13333 100%)",
          };
        case "AFC":
          return {
            backgroundImage:
              "linear-gradient(90deg, #f59e0b 0%, #f8fafc 50%, #dc2626 100%)",
          };
        case "CAF":
          return {
            backgroundImage:
              "linear-gradient(90deg, #16a34a 0%, #f4c430 50%, #dc2626 100%)",
          };
        default:
          if (!banderaSrc) return undefined;

          return {
            backgroundImage:
              "linear-gradient(90deg, #5993B6 0%, #f8fafc 52%, #FAB438 100%)",
          };
      }
  }
}

export default function EditarPaisPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const canEditarPaises = useCan("paises", "editar");

  const [pais, setPais] = useState<Pais | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canEditarPaises) {
      setLoading(false);
      return;
    }

    const loadPais = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/paises/${params.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        });

        if (!response.ok) {
          toast.error("Seleccion no encontrada");
          router.push("/admin/paises");
          return;
        }

        const data = (await response.json()) as Pais;
        setPais(data);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error al cargar la seleccion");
        router.push("/admin/paises");
      } finally {
        setLoading(false);
      }
    };

    void loadPais();
  }, [canEditarPaises, params.id, router]);

  if (loading) return <DashboardLoading badgeLabel="Loading paises detalle" />;
  if (!canEditarPaises) return <AccessDenied403Page />;
  if (!pais) return null;

  const banderaSrc = resolveBanderaSrc(pais.bandera, pais.codigo);
  const mascotSrc = getMascotForSeleccion(pais.confederacion);
  const titleFlagStyle = getTitleFlagStyle(pais, banderaSrc);

  return (
    <div className="space-y-6">
      <section className={`${DASHBOARD_PANEL} rounded-[32px] p-3 md:p-4`}>
        <div className={DASHBOARD_TOP_LINE}>
          <div className={DASHBOARD_TOP_LINE_INNER} />
          <div className={DASHBOARD_TOP_LINE_SWEEP} />
          <div className={DASHBOARD_TOP_LINE_GLOW} />
          <div className={DASHBOARD_TOP_LINE_HAIR} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_15%_15%,rgba(250,180,56,0.18),transparent_18%)] opacity-85" />

        <div className="grid w-full min-w-0 gap-4 2xl:grid-cols-[minmax(0,2.05fr)_minmax(300px,0.95fr)] 2xl:items-stretch">
          <section className="relative h-full w-full min-w-0 overflow-hidden rounded-[30px] border border-white/10 bg-[#1E2C46] px-4 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] md:px-6 md:py-6 xl:h-[364px] xl:px-7 xl:py-6 2xl:h-[420px] 2xl:px-8 2xl:py-7">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,44,70,0.94)_0%,rgba(30,44,70,0.9)_36%,rgba(37,53,80,0.62)_62%,rgba(30,44,70,0.76)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(89,147,182,0.22),transparent_30%),radial-gradient(circle_at_34%_0%,rgba(246,180,56,0.14),transparent_35%),linear-gradient(135deg,rgba(30,44,70,0.24)_0%,rgba(37,53,80,0.14)_46%,rgba(30,44,70,0.24)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.06)_48%,transparent_62%)] opacity-45" />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#061B33]/75 via-[#061B33]/24 to-transparent" />
              <div className="absolute right-10 top-8 h-56 w-56 rounded-full bg-sky-300/18 blur-3xl" />
              <div className="absolute -left-8 bottom-5 h-28 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
            </div>

            <div className="relative z-10 flex h-full max-w-[62%] min-w-0 flex-col">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3] backdrop-blur-md">
                Editar selección
              </div>

              <div className="mt-6 space-y-2.5 xl:mt-8">
                <h1 className="text-[2.1rem] font-bold leading-[0.98] tracking-[-0.065em] md:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
                  Ajustes de <span className="text-[#5993B6]">identidad</span>
                </h1>

                <div className="relative max-w-[540px]">
                  {titleFlagStyle ? (
                    <p
                      className="font-brand inline-block text-[2.35rem] font-semibold leading-[0.96] tracking-[0.04em] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] [text-stroke:0.65px_rgba(15,23,42,0.3)] [-webkit-text-stroke:0.65px_rgba(15,23,42,0.3)] opacity-[0.99] [filter:drop-shadow(1px_0_0_rgba(255,255,255,0.56))_drop-shadow(2px_0_0_rgba(255,255,255,0.2))_drop-shadow(2px_1px_5px_rgba(255,255,255,0.08))] md:text-[2.45rem] xl:text-[2.8rem] 2xl:text-[3.05rem]"
                      style={titleFlagStyle}
                    >
                      {pais.nombre}
                    </p>
                  ) : (
                    <p className="font-brand text-[2.35rem] font-semibold leading-[0.96] tracking-[0.04em] text-white md:text-[2.45rem] xl:text-[2.8rem] 2xl:text-[3.05rem]">
                      {pais.nombre}
                    </p>
                  )}
                </div>

                <p className="max-w-[470px] pt-2 text-[0.95rem] leading-5 text-white/78 xl:text-[1rem]">
                  Modifica datos clave, valida la identidad visual y entra rápido al
                  plantel de la selección sin salir del flujo administrativo.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-8 xl:pt-10 2xl:pt-14">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/paises")}
                  className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Volver a selecciones
                </Button>

                <Button
                  type="button"
                  onClick={() => router.push(`/admin/paises/${params.id}/plantel`)}
                  className="rounded-2xl bg-[#FAB438] font-semibold text-[#1E2C46] hover:bg-[#F7C45A]"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Ir al plantel
                </Button>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-[-13px] right-[-7px] z-20 hidden h-[368px] w-[310px] xl:block 2xl:bottom-[-19px] 2xl:right-[-1px] 2xl:h-[446px] 2xl:w-[359px]">
              <div className="absolute inset-2 rounded-full bg-[#5993B6]/22 blur-[120px]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,44,70,0)_48%,rgba(30,44,70,0.16)_78%,rgba(30,44,70,0.32)_100%)]" />
              <HeroVisualImage
                src={mascotSrc}
                alt=""
                sizes="(min-width: 1536px) 420px, 360px"
                baseClassName="relative object-contain object-[center_bottom] brightness-110 drop-shadow-[0_30px_68px_rgba(0,0,0,0.32)] [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)]"
                loadedClassName="scale-100 opacity-[0.78]"
                loadingClassName="scale-[0.97] opacity-0"
              />
            </div>
          </section>

          <aside className={DASHBOARD_PANEL}>
            <div className={DASHBOARD_TOP_LINE}>
              <div className={DASHBOARD_TOP_LINE_INNER} />
              <div className={DASHBOARD_TOP_LINE_SWEEP} />
              <div className={DASHBOARD_TOP_LINE_GLOW} />
              <div className={DASHBOARD_TOP_LINE_HAIR} />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.05)_42%,transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="mb-3">
              <p className="mt-4 flex justify-center text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                Estado actual
              </p>
              <p className="mt-1.5 flex items-start justify-center gap-2 text-center text-sm font-semibold leading-5 text-white/68">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="max-w-[260px]">
                  Resumen rápido para validar la selección antes de guardar cambios.
                </span>
              </p>
            </div>

            <div className="space-y-2.5">
              <div className={`flex w-full min-w-0 items-center gap-3 rounded-[22px] px-3 py-3 xl:px-3.5 ${DASHBOARD_SUBCARD}`}>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#5993B6]/18 text-[#AEEBFF]">
                  <Globe2 className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-[13px] font-black leading-4 text-white">
                    Confederación
                  </span>
                  <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-white/64">
                    {pais.confederacion || "Pendiente"}
                  </span>
                </span>
                <span className="font-brand text-[1.7rem] leading-none tracking-[0.03em] text-white">
                  {pais.confederacion ? "OK" : "--"}
                </span>
              </div>

              <div className={`flex w-full min-w-0 items-center gap-3 rounded-[22px] px-3 py-3 xl:px-3.5 ${DASHBOARD_SUBCARD}`}>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#FAB438]/14 text-[#FFE4A3]">
                  <Medal className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-[13px] font-black leading-4 text-white">
                    Grupo actual
                  </span>
                  <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-white/64">
                    Ubicación de fase inicial
                  </span>
                </span>
                <span className="font-brand text-[1.7rem] leading-none tracking-[0.03em] text-white">
                  {pais.grupo || "--"}
                </span>
              </div>

              <div className={`flex w-full min-w-0 items-center gap-3 rounded-[22px] px-3 py-3 xl:px-3.5 ${DASHBOARD_SUBCARD}`}>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-400/14 text-emerald-200">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-[13px] font-black leading-4 text-white">
                    Estado
                  </span>
                  <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-white/64">
                    Disponibilidad dentro del sistema
                  </span>
                </span>
                <span className="font-brand text-[1.7rem] leading-none tracking-[0.03em] text-white">
                  {pais.activo ? "ON" : "OFF"}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_360px]">
        <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_14%_18%,rgba(250,180,56,0.14),transparent_20%)] opacity-90" />

          <div className="relative z-10 space-y-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#AEEBFF]">
                Formulario principal
              </p>
              <h2 className="font-brand mt-2 text-[2rem] leading-[0.92] tracking-[0.04em] text-white">
                {pais.nombre}
              </h2>
              <p className="mt-2 max-w-[760px] text-sm leading-6 text-white/72">
                Mantiene la lógica del formulario original, pero con un lenguaje visual
                alineado al dashboard aprobado.
              </p>
            </div>

            <PaisForm
              mode="edit"
              pais={pais}
              variant="dashboard"
              onSuccess={() => {
                router.push("/admin/paises");
              }}
            />
          </div>
        </section>

        <div className="space-y-4">
          <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
            <div className={DASHBOARD_TOP_LINE}>
              <div className={DASHBOARD_TOP_LINE_INNER} />
              <div className={DASHBOARD_TOP_LINE_SWEEP} />
              <div className={DASHBOARD_TOP_LINE_GLOW} />
              <div className={DASHBOARD_TOP_LINE_HAIR} />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.18),transparent_35%),radial-gradient(circle_at_20%_16%,rgba(250,180,56,0.12),transparent_22%)] opacity-90" />

            <div className="relative z-10 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#AEEBFF]">
                Acciones rápidas
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => router.push(`/admin/paises/${params.id}/plantel`)}
                  className={`w-full rounded-2xl p-4 text-left ${DASHBOARD_SUBCARD}`}
                >
                  <p className="text-sm font-semibold text-white">Administrar plantel</p>
                  <p className="mt-1 text-sm text-white/64">
                    Salto directo al listado de convocados y edición del plantel.
                  </p>
                </button>

                <div className={`rounded-2xl p-4 ${DASHBOARD_SUBCARD}`}>
                  <p className="text-sm font-semibold text-white">Vista actual</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-16 w-20 items-center justify-center rounded-2xl border border-white/12 bg-white/10">
                      {banderaSrc ? (
                        <FlagImage
                          bandera={pais.bandera}
                          codigo={pais.codigo}
                          nombre={pais.nombre}
                          widthClassName="w-14"
                          heightClassName="h-10"
                          fallbackMode="emoji"
                        />
                      ) : (
                        <span className="text-white/68">Sin imagen</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{pais.nombre}</p>
                      <p className="text-sm text-white/64">{pais.codigo}</p>
                    </div>
                  </div>
                </div>

                <div className={`rounded-2xl p-4 ${DASHBOARD_SUBCARD}`}>
                  <p className="text-sm font-semibold text-white">Atajos sugeridos</p>
                  <p className="mt-1 text-sm text-white/64">
                    Después de guardar, podés volver al overview o continuar con el plantel.
                  </p>
                </div>
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
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_18%_18%,rgba(250,180,56,0.12),transparent_22%)] opacity-90" />

            <div className="relative z-10 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#AEEBFF]">
                Guía rápida
              </p>
              <div className="space-y-3">
                {[
                  "Edita nombre, código, grupo y confederación.",
                  "Puedes reemplazar la bandera por drag and drop o URL.",
                  "Los cambios siguen usando la misma validación del formulario real.",
                ].map((idea) => (
                  <div key={idea} className={`rounded-2xl p-4 ${DASHBOARD_SUBCARD}`}>
                    <p className="text-sm leading-6 text-white/76">{idea}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
