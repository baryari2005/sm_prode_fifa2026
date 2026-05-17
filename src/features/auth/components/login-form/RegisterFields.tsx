"use client";

import type { UseFormReturn } from "react-hook-form";

import type { RegisterSchemaValues } from "@/features/auth/schemas/schemas";
import { AccessFields } from "../register-fields/AccessFields";
import { PersonalDataFields } from "../register-fields/PersonalDataFields";
import { AddressFields } from "../register-fields/AddressFields";
import { TermsAndConditionsField } from "../register-fields/TermsAndConditionsField";


export type RegisterFormValues = RegisterSchemaValues;

type Props = {
  form: UseFormReturn<RegisterFormValues>;
};

export function RegisterFields({ form }: Props) {
  return (
    <div className="space-y-6">
      <AccessFields form={form} />

      <PersonalDataFields form={form} />

      <AddressFields form={form} />

      <TermsAndConditionsField form={form} />
    </div>
  );
}