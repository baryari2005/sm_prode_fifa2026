"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";

import { incidentFormMock } from "./incidents-mock.data";

function MockField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
        {label}
      </label>
      {children}
    </div>
  );
}

export function IncidentFormMock() {
  return (
    <>
      <TabsContent value="gol" className="mt-4">
        <div className="grid gap-4 rounded-[24px] border border-white/10 bg-white/[0.05] p-4 md:grid-cols-2">
          <MockField label="Minuto">
            <Input value={incidentFormMock.gol.minuto} readOnly className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white" />
          </MockField>
          <MockField label="Equipo">
            <Select defaultValue={incidentFormMock.gol.equipo}>
              <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Mexico">Mexico</SelectItem><SelectItem value="Sudafrica">Sudafrica</SelectItem></SelectContent>
            </Select>
          </MockField>
          <MockField label="Quien hizo el gol">
            <Select defaultValue={incidentFormMock.gol.jugador}>
              <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Santiago Gimenez">Santiago Gimenez</SelectItem><SelectItem value="Orbelin Pineda">Orbelin Pineda</SelectItem></SelectContent>
            </Select>
          </MockField>
          <MockField label="Asistidor">
            <Select defaultValue={incidentFormMock.gol.asistidor}>
              <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Orbelin Pineda">Orbelin Pineda</SelectItem><SelectItem value="Luis Chavez">Luis Chavez</SelectItem></SelectContent>
            </Select>
          </MockField>
          <div className="md:col-span-2">
            <MockField label="Descripcion">
              <Input value={incidentFormMock.gol.descripcion} readOnly className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white" />
            </MockField>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="tarjeta" className="mt-4">
        <div className="grid gap-4 rounded-[24px] border border-white/10 bg-white/[0.05] p-4 md:grid-cols-2">
          <MockField label="Minuto"><Input value={incidentFormMock.tarjeta.minuto} readOnly className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white" /></MockField>
          <MockField label="Equipo">
            <Select defaultValue={incidentFormMock.tarjeta.equipo}>
              <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Sudafrica">Sudafrica</SelectItem><SelectItem value="Mexico">Mexico</SelectItem></SelectContent>
            </Select>
          </MockField>
          <MockField label="Jugador">
            <Select defaultValue={incidentFormMock.tarjeta.jugador}>
              <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Percy Tau">Percy Tau</SelectItem><SelectItem value="Teboho Mokoena">Teboho Mokoena</SelectItem></SelectContent>
            </Select>
          </MockField>
          <MockField label="Tipo">
            <Select defaultValue={incidentFormMock.tarjeta.tipo}>
              <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Amarilla">Amarilla</SelectItem><SelectItem value="Roja">Roja</SelectItem></SelectContent>
            </Select>
          </MockField>
          <div className="md:col-span-2">
            <MockField label="Descripcion"><Input value={incidentFormMock.tarjeta.descripcion} readOnly className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white" /></MockField>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="cambio" className="mt-4">
        <div className="grid gap-4 rounded-[24px] border border-white/10 bg-white/[0.05] p-4 md:grid-cols-2">
          <MockField label="Minuto"><Input value={incidentFormMock.cambio.minuto} readOnly className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white" /></MockField>
          <MockField label="Equipo">
            <Select defaultValue={incidentFormMock.cambio.equipo}>
              <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Mexico">Mexico</SelectItem><SelectItem value="Sudafrica">Sudafrica</SelectItem></SelectContent>
            </Select>
          </MockField>
          <MockField label="Jugador que sale">
            <Select defaultValue={incidentFormMock.cambio.sale}>
              <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Raul Jimenez">Raul Jimenez</SelectItem></SelectContent>
            </Select>
          </MockField>
          <MockField label="Jugador que entra">
            <Select defaultValue={incidentFormMock.cambio.entra}>
              <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Santiago Gimenez">Santiago Gimenez</SelectItem></SelectContent>
            </Select>
          </MockField>
          <div className="md:col-span-2">
            <MockField label="Descripcion"><Input value={incidentFormMock.cambio.descripcion} readOnly className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white" /></MockField>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="lesion" className="mt-4">
        <div className="grid gap-4 rounded-[24px] border border-white/10 bg-white/[0.05] p-4 md:grid-cols-2">
          <MockField label="Minuto"><Input value={incidentFormMock.lesion.minuto} readOnly className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white" /></MockField>
          <MockField label="Equipo">
            <Select defaultValue={incidentFormMock.lesion.equipo}>
              <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Sudafrica">Sudafrica</SelectItem></SelectContent>
            </Select>
          </MockField>
          <MockField label="Jugador">
            <Select defaultValue={incidentFormMock.lesion.jugador}>
              <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Teboho Mokoena">Teboho Mokoena</SelectItem></SelectContent>
            </Select>
          </MockField>
          <div className="md:col-span-2">
            <MockField label="Descripcion"><Input value={incidentFormMock.lesion.descripcion} readOnly className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white" /></MockField>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="penal" className="mt-4">
        <div className="grid gap-4 rounded-[24px] border border-white/10 bg-white/[0.05] p-4 md:grid-cols-2">
          <MockField label="Minuto"><Input value={incidentFormMock.penal.minuto} readOnly className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white" /></MockField>
          <MockField label="Equipo">
            <Select defaultValue={incidentFormMock.penal.equipo}>
              <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Mexico">Mexico</SelectItem></SelectContent>
            </Select>
          </MockField>
          <MockField label="Ejecutor">
            <Select defaultValue={incidentFormMock.penal.jugador}>
              <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Santiago Gimenez">Santiago Gimenez</SelectItem></SelectContent>
            </Select>
          </MockField>
          <div className="md:col-span-2">
            <MockField label="Descripcion"><Input value={incidentFormMock.penal.descripcion} readOnly className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white" /></MockField>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="var" className="mt-4">
        <div className="grid gap-4 rounded-[24px] border border-white/10 bg-white/[0.05] p-4 md:grid-cols-2">
          <MockField label="Minuto"><Input value={incidentFormMock.var.minuto} readOnly className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white" /></MockField>
          <MockField label="Equipo">
            <Select defaultValue={incidentFormMock.var.equipo}>
              <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="General">General</SelectItem></SelectContent>
            </Select>
          </MockField>
          <div className="md:col-span-2">
            <MockField label="Descripcion"><Input value={incidentFormMock.var.descripcion} readOnly className="h-11 rounded-xl border-white/10 bg-white/[0.08] text-white" /></MockField>
          </div>
        </div>
      </TabsContent>

      <div className="mt-4 flex justify-end gap-3">
        <Button variant="outline" className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15">
          Limpiar
        </Button>
        <Button className="rounded-2xl bg-[#FAB438] text-[#1E2C46] hover:bg-[#F7C45A]">
          Agregar incidencia
        </Button>
      </div>
    </>
  );
}
