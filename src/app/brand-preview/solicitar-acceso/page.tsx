import { BrandAccessRequestMock } from "@/components/brand/BrandAccessRequestMock";
import { BrandPageShell } from "@/components/brand/BrandPageShell";
import { BrandTitle } from "@/components/brand/BrandTitle";

export default function BrandPreviewAccessRequestPage() {
  return (
    <BrandPageShell contentClassName="space-y-6 pb-16">
      <BrandTitle
        eyebrow="Mock de solicitar acceso"
        description="Propuesta visual aislada para validar la pantalla de solicitud antes de tocar la ruta real."
      >
        Preview de solicitar acceso
      </BrandTitle>

      <BrandAccessRequestMock />
    </BrandPageShell>
  );
}
