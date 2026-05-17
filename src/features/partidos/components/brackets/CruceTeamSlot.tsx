import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { resolveBanderaSrc } from "@/lib/flags";

type CruceTeamSlotProps = {
  label: string;
  value: string;
  resolved: boolean;
  side: "local" | "visitante";
  bandera?: string | null;
  codigo?: string | null;
  nombre?: string;
};

export function CruceTeamSlot({
  label,
  value,
  resolved,
  side,
  bandera,
  codigo,
  nombre,
}: CruceTeamSlotProps) {
  const isLocal = side === "local";

  return (
    <div
      className={`flex min-w-0 items-center justify-center gap-3 ${
        isLocal ? "md:justify-end" : "md:justify-start"
      }`}
    >
      {isLocal && (
        <CruceTeamText
          label={label}
          value={value}
          resolved={resolved}
          bandera={bandera}
          codigo={codigo}
          nombre={nombre ?? value}
        />
      )}

      {/* <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#008C93]/15 bg-[#008C93]/10 text-[#008C93]">
        <ShieldQuestion className="h-5 w-5" />
      </div> */}

      {!isLocal && (
        <CruceTeamText
          label={label}
          value={value}
          resolved={resolved}
          bandera={bandera}
          codigo={codigo}
          nombre={nombre ?? value}
        />
      )}
    </div>
  );
}

function CruceTeamText({
  label,
  value,
  resolved,
  bandera,
  codigo,
  nombre,
}: {
  label: string;
  value: string;
  resolved: boolean;
  bandera?: string | null;
  codigo?: string | null;
  nombre: string;
}) {
  return (
    <div className="min-w-0 text-center md:text-left">

      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#008C93]/70">
        {label}
      </p>
      <div className="mt-2 flex items-center justify-center gap-2 md:justify-start">
        <p className="max-w-[160px] truncate text-base font-extrabold tracking-[-0.02em] text-slate-950 md:max-w-[220px]">
          {value}
        </p>

        {resolved ? (
          <TeamFlag bandera={bandera} codigo={codigo} nombre={nombre} />
        ) : null}
      </div>

      <Badge
        variant="secondary"
        className={
          resolved
            ? "mt-2 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700"
            : "mt-2 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700"
        }
      >
        {resolved ? "Definido" : "Por definir"}
      </Badge>
    </div>
  );
}

function TeamFlag({
  bandera,
  codigo,
  nombre,
}: {
  bandera?: string | null;
  codigo?: string | null;
  nombre: string;
}) {
  const value = bandera?.trim();
  const src = resolveBanderaSrc(value, codigo);
  const flagClassName = "h-6 w-8 shrink-0 rounded object-contain shadow-none";
  const flagWrapperClassName =
    "flex h-6 w-8 shrink-0 items-center justify-center overflow-hidden rounded";

  if (!value) {
    return (
      <span className={`${flagWrapperClassName} bg-slate-50 text-sm`}>🏳️</span>
    );
  }

  if (src) {
    return (
      <span className={flagWrapperClassName}>
        <Image
          src={src}
          alt={`Bandera de ${nombre || "selección"}`}
          width={32}
          height={24}
          unoptimized
          className={flagClassName}
        />
      </span>
    );
  }
  
  return (
    <span className={`${flagWrapperClassName} bg-white px-1 text-base`}>
      {value}
    </span>
  );

}
