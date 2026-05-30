"use client";

import type { UseFormReturn } from "react-hook-form";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RegisterSchemaValues } from "@/features/auth/schemas/schemas";

import { AccessFields } from "../register-fields/AccessFields";
import { AddressFields } from "../register-fields/AddressFields";
import { PersonalDataFields } from "../register-fields/PersonalDataFields";
import { TermsAndConditionsField } from "../register-fields/TermsAndConditionsField";
import { IdentificationDataFields } from "../register-fields/IdentificationDataFields";

export type RegisterFormValues = RegisterSchemaValues;

type Props = {
  form: UseFormReturn<RegisterFormValues>;
};

const tabTriggerClassName =
  "min-w-0 rounded-full border border-transparent bg-transparent px-2.5 py-2 text-[12px] font-semibold text-white/56 shadow-none transition " +
  "data-[state=active]:border-[#5993B6]/40 data-[state=active]:bg-[#5993B6]/10 data-[state=active]:text-[#AEEBFF] data-[state=active]:shadow-none";

export function RegisterFields({ form }: Props) {
  return (
    <Tabs defaultValue="acceso" className="space-y-4 overflow-x-hidden">
      <div className="border-b border-white/10 pb-3">
        <TabsList className="grid h-auto w-full grid-cols-5 gap-2 rounded-none !border-0 !bg-transparent p-0 !shadow-none !backdrop-blur-none">
          <TabsTrigger value="acceso" className={tabTriggerClassName}>
            Acceso
          </TabsTrigger>

          <TabsTrigger value="personales" className={tabTriggerClassName}>
            Datos básicos
          </TabsTrigger>

          <TabsTrigger value="identificacion" className={tabTriggerClassName}>
            Identificación
          </TabsTrigger>

          <TabsTrigger value="domicilio" className={tabTriggerClassName}>
            Domicilio
          </TabsTrigger>

          <TabsTrigger value="bases" className={tabTriggerClassName}>
            Condiciones
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        value="acceso"
        forceMount
        className="space-y-4 data-[state=inactive]:hidden"
      >
        <AccessFields form={form} />
      </TabsContent>

      <TabsContent
        value="personales"
        forceMount
        className="space-y-4 data-[state=inactive]:hidden"
      >
        <PersonalDataFields form={form} />
      </TabsContent>

      <TabsContent
        value="identificacion"
        forceMount
        className="space-y-4 data-[state=inactive]:hidden"
      >
        <IdentificationDataFields form={form} />
      </TabsContent>

      <TabsContent
        value="domicilio"
        forceMount
        className="space-y-4 data-[state=inactive]:hidden"
      >
        <AddressFields form={form} />
      </TabsContent>

      <TabsContent
        value="bases"
        forceMount
        className="space-y-4 data-[state=inactive]:hidden"
      >
        <TermsAndConditionsField form={form} />
      </TabsContent>
    </Tabs>
  );
}