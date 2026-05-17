"use client";

import Image from "next/image";

export function LoginMascotSection() {
  return (
    <section className="order-3 relative flex min-h-[520px] items-center justify-center overflow-hidden px-5 py-8 lg:order-2 lg:min-h-screen lg:px-4">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B8EF6A]/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[18%] left-1/2 h-[320px] w-[560px] -translate-x-1/2 rounded-full bg-[#F7B731]/10 blur-[110px]" />
      <div className="pointer-events-none absolute right-[18%] top-[24%] h-[260px] w-[260px] rounded-full bg-emerald-400/10 blur-[100px]" />

      <div className="relative flex w-full max-w-[620px] flex-col items-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -inset-8 rounded-full bg-gradient-to-br from-[#B8EF6A]/18 via-transparent to-[#F7B731]/14 blur-3xl" />

        <div className="mb-4 inline-flex items-center rounded-full border border-white/14
           bg-[#031A14]/55 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#F7B731] backdrop-blur-xl">
          Mundial 2026
        </div>

        <Image
          src="/fifa2026.png"
          alt="Prode Mundial 2026 presentado por Más San Miguel"
          width={1122}
          height={1402}
          priority
          className="
            relative z-10
            h-auto
            w-full
            max-w-[390px]
            select-none
            object-contain
            opacity-95
            drop-shadow-[0_42px_100px_rgba(0,0,0,0.62)]
            sm:max-w-[440px]
            lg:max-w-[470px]
            xl:max-w-[500px]            
          "
        />

        <div className="relative z-10 mt-6 max-w-[380px] rounded-[1.5rem] border border-white/12 bg-[#071A14]/70 px-5 py-4 text-center shadow-xl shadow-black/25 backdrop-blur-xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#F7B731]">
            Mejor experiencia visual
          </p>

          <p className="mt-2 text-sm font-medium leading-6 text-white/72">
            Para seguir partidos, ranking y pronósticos con mayor comodidad, te
            recomendamos usar notebook, PC o tablet.
          </p>
        </div>
      </div>
    </section>
  );
}
