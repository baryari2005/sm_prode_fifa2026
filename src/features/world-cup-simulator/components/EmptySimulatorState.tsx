"use client";

export function EmptySimulatorState() {
  return (
    <div className="rounded-[30px] border border-dashed border-white/14 bg-white/[0.05] px-6 py-14 text-center text-white">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
        Simulador sin base
      </p>
      <h2 className="mt-3 text-2xl font-black">Todavía no hay partidos cargados para simular.</h2>
      <p className="mt-3 text-sm text-white/65">
        Cuando existan partidos de fase de grupos en el sistema, esta pantalla podrá armar tablas, mejores terceros y llave final.
      </p>
    </div>
  );
}
