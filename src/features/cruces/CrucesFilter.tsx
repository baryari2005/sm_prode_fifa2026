import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";

export type CruceFiltro =
  | "todos"
  | "16vos"
  | "8vos"
  | "4to"
  | "semi"
  | "tercer-puesto"
  | "final";

const CRUCES_TABS: { value: CruceFiltro; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "16vos", label: "16vos" },
  { value: "8vos", label: "8vos" },
  { value: "4to", label: "Cuartos" },
  { value: "semi", label: "Semis" },
  { value: "tercer-puesto", label: "3er puesto" },
  { value: "final", label: "Final" },
];

interface CrucesFilterProps {
  filtroActivo: CruceFiltro;
  onFiltroChange: (filtro: CruceFiltro) => void;
}

export function CrucesFilter({
  filtroActivo,
  onFiltroChange,
}: CrucesFilterProps) {
  return (
    <CardHeader className="px-5 py-5 md:px-6">
      <div className="flex flex-wrap gap-2">
        {CRUCES_TABS.map((tab) => (
          <Button
            key={tab.value}
            type="button"
            variant={filtroActivo === tab.value ? "default" : "outline"}
            onClick={() => onFiltroChange(tab.value)}
            size="sm"
            className="rounded-xl"
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </CardHeader>
  );
}