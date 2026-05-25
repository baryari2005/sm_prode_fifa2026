import { Badge } from "@/components/ui/badge";
import { FlagImage } from "@/components/ui/flag-image";

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
          <FlagImage
            bandera={bandera}
            codigo={codigo}
            nombre={nombre}
            widthClassName="w-8"
            heightClassName="h-6"
            fallbackMode="emoji"
            fallbackTextClassName="text-sm"
          />
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
