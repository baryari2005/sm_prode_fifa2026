import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

type Props = {
  loading: boolean;
  onExport: () => Promise<void> | void;
};

export function ExportUsersAction({ loading, onExport }: Props) {
  return (
    <Button
      onClick={onExport}
      disabled={loading}
      className="h-12 w-full rounded-2xl bg-[#008C93] font-semibold text-white hover:bg-[#007381]"
    >
      {loading ? (
        <>
          <FileDown className="h-5 w-5 mr-2 animate-bounce" />
          Exportando...
        </>
      ) : (
        <>
          <FileDown className="h-5 w-5 mr-2" />
          Exportar en Excel
        </>
      )}
    </Button>
  );
}
