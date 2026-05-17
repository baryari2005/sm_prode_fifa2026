// "use client";

// import Image from "next/image";

// const stats = [
//   {
//     src: "/48.png",
//     alt: "48 selecciones participantes en el Mundial 2026",
//     width: 180,
//     height: 180,
//     className: "w-[98px] sm:w-[110px]",
//   },
//   {
//     src: "/104.png",
//     alt: "104 partidos en el Mundial 2026",
//     width: 130,
//     height: 130,
//     className: "w-[105px] sm:w-[120px]",
//   },
//   {
//     src: "/ranking.png",
//     alt: "Ranking del Prode Mundial 2026",
//     width: 180,
//     height: 180,
//     className: "w-[105px] sm:w-[115px]",
//   },
// ];

// export function LoginStatsCards() {
//   return (
//     <div className="grid max-w-xl grid-cols-3 gap-3 sm:gap-4">
//       {stats.map((item) => (
//         <div
//           key={item.src}
//           className="group flex min-h-[105px] items-center justify-center rounded-[1.35rem] border border-white/15 bg-white/[0.09] p-4 shadow-lg shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#39A935]/50 hover:bg-white/[0.14] sm:min-h-[125px] sm:p-5"
//         >
//           <Image
//             src={item.src}
//             alt={item.alt}
//             width={item.width}
//             height={item.height}
//             className={`h-auto select-none object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.28)] transition duration-300 group-hover:scale-105 ${item.className}`}
//           />
//         </div>
//       ))}
//     </div>
//   );
// }
"use client";

import { ProdeIcon } from "@/components/icons/Iconos";
import type { LucideIcon } from "lucide-react";
import { BarChart3, Users } from "lucide-react";



type StatItem = {
  title: string;
  description: string;
  icon?: LucideIcon;
  source?: string;
};

const stats: StatItem[] = [
  {
    source: "/trofeo.ico",
    title: "48 selecciones",
    description: "Participantes del Mundial 2026",
  },
  {
    icon: BarChart3,
    title: "104 partidos",
    description: "Para pronosticar y seguir",
  },
  {
    icon: Users,
    title: "Ranking",
    description: "Competí con tu grupo",
  },
];

export function LoginStatsCards() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:max-w-[620px]">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <article
            key={item.title}
            className="rounded-2xl border border-white/14 bg-white/8 p-4 shadow-lg shadow-black/20 backdrop-blur-xl"
          >
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl border border-[#B8EF6A]/25 bg-[#B8EF6A]/10 text-[#D7FF87]">
              {item.source ? (
                <ProdeIcon
                  source={item.source}
                  mode="mask"
                  className="h-6 w-6 text-[#D7FF87]"
                />
              ) : Icon ? (
                <Icon className="h-5 w-5" />
              ) : null}
            </div>

            <h3 className="text-sm font-black text-white">{item.title}</h3>

            <p className="mt-1 text-xs font-semibold leading-5 text-white/60">
              {item.description}
            </p>
          </article>
        );
      })}
    </div>
  );
}