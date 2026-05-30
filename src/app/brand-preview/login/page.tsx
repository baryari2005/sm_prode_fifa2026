import { BrandLoginMock } from "@/components/brand/BrandLoginMock";
import { BrandPageShell } from "@/components/brand/BrandPageShell";
import { BrandTitle } from "@/components/brand/BrandTitle";

export default function BrandPreviewLoginPage() {
  return (
    <BrandPageShell contentClassName="space-y-6 pb-16">
      <BrandTitle
        eyebrow="Mock de login"
        description="Propuesta visual aislada para validar el login final antes de tocar la pantalla real."
      >
        Preview de login
      </BrandTitle>

      <BrandLoginMock />
    </BrandPageShell>
  );
}
