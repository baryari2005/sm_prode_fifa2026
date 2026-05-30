"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

import { incidentTypeOptions } from "./incidents-mock.data";

export function IncidentTypeTabs() {
  return (
    <TabsList className="h-auto rounded-full border border-white/10 bg-white/[0.05] p-1 shadow-sm">
      {incidentTypeOptions.map((option) => {
        const Icon = option.icon;

        return (
          <TabsTrigger
            key={option.key}
            value={option.key}
            className="rounded-full px-4 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-white/68 data-[state=active]:bg-[#5993B6] data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            <Icon className={`mr-2 h-3.5 w-3.5 ${option.toneClassName}`} />
            {option.label}
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
}
