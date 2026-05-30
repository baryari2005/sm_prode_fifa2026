// src/app/layout.tsx

import "./globals.css";
import Image from "next/image";
import { Toaster } from "@/components/ui/sonner";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import { Smartphone, MonitorSmartphone } from "lucide-react";
import { brandImages } from "@/config/brand-images";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-app-sans",
  display: "swap",
});

const cheddar = localFont({
  src: "../../public/fonts/cheddar-gothic-sans.otf",
  variable: "--font-brand-display",
  display: "swap",
});

export const metadata = {
  title: "Prode Mundial 2026",
  description: "Sistema interno de predicciones para el Mundial 2026",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${poppins.variable} ${cheddar.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <div className="lg:hidden">
          <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-10 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_38%),radial-gradient(circle_at_bottom,rgba(34,197,94,0.18),transparent_34%)]" />

            <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-white/8 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                <MonitorSmartphone className="h-8 w-8 text-cyan-300" />
              </div>

              <h1 className="mt-6 text-3xl font-extrabold tracking-tight">
                Esta versi&oacute;n no est&aacute; optimizada para pantallas chicas
              </h1>

              <p className="mt-4 text-sm leading-6 text-slate-200">
                Para continuar, ingres&aacute; desde una computadora o utiliz&aacute; la app del celular.
              </p>

              <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-4 text-left">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-cyan-300" />
                  <p className="text-sm font-semibold text-cyan-100">
                    Acceso bloqueado en navegador m&oacute;vil
                  </p>
                </div>

                <p className="mt-2 text-sm text-slate-200">
                  Abr&iacute; la app del celular para una experiencia adaptada, o ingres&aacute; desde una pantalla m&aacute;s grande.
                </p>
              </div>
            </div>
          </main>
        </div>

        <div className="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(117,215,255,0.08),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(246,200,95,0.06),transparent_22%)]" />
          <div className="absolute right-[-6%] top-1/2 h-[72vh] w-[72vh] -translate-y-1/2 opacity-[0.06]">
            <Image
              src={brandImages.institucional.masSanMiguelLogo}
              alt=""
              fill
              priority
              aria-hidden="true"
              className="object-contain blur-[1px]"
            />
          </div>
        </div>

        <div className="relative z-10 hidden lg:block">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
