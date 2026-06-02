import type { UseFormReturn } from "react-hook-form";
import type {
  RegisterSchemaInput,
  RegisterSchemaValues,
} from "@/features/auth/schemas/schemas";

export type RegisterFormValues = RegisterSchemaInput;
export type RegisterFormReturn = UseFormReturn<
  RegisterFormValues,
  undefined,
  RegisterSchemaValues
>;

export type RegisterFieldsSectionProps = {
  form: RegisterFormReturn;
};
