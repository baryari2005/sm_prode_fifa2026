// src/app/layout.tsx

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-app-sans",
  display: "swap",
});

export const metadata = {
  title: "Prode Mundial 2026",
  description: "Sistema interno de predicciones para el Mundial 2026",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}