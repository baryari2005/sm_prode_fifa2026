import type { UseFormReturn } from "react-hook-form";
import type { RegisterSchemaValues } from "@/features/auth/schemas/schemas";

export type RegisterFormValues = RegisterSchemaValues;

export type RegisterFieldsSectionProps = {
  form: UseFormReturn<RegisterFormValues>;
};