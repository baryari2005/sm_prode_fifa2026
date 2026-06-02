"use client";

import { useMemo, useRef, useState } from "react";
import { useForm, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { messages } from "@/utils/messages";
import {
  registerSchema,
  type RegisterSchemaInput,
  type RegisterSchemaValues,
} from "../schemas/schemas";

export type Values = RegisterSchemaValues;
type FormValues = RegisterSchemaInput;

const REGISTER_DEFAULT_VALUES: DefaultValues<FormValues> = {
  userId: "",
  email: "",
  password: "",
  nombre: "",
  apellido: "",
  tipoDocumento: "DNI",
  documento: "",
  domicilio: "",
  localidad: "San Miguel",
  acceptedTerms: false,
};

export function useRegister() {
  const [registerError, setRegisterError] = useState<string | null>(null);
  const netSubmittingRef = useRef(false);

  const form = useForm<FormValues, undefined, Values>({
    resolver: zodResolver(registerSchema),
    defaultValues: REGISTER_DEFAULT_VALUES,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const dismissRegisterError = () => {
    setRegisterError(null);
    form.clearErrors();
  };

  const topError = useMemo(() => {
    if (!form.formState.isSubmitted) {
      return null;
    }

    if (registerError) {
      return registerError;
    }

    const { errors } = form.formState;
    const firstError = Object.values(errors)[0];
    return firstError?.message || messages.errors.registerError;
  }, [registerError, form.formState]);

  const onSubmit = async (values: Values) => {
    if (netSubmittingRef.current) {
      return;
    }

    netSubmittingRef.current = true;
    setRegisterError(null);

    try {
      const payload = {
        ...values,
        localidad: "San Miguel" as const,
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.error || messages.errors.registerError;
        setRegisterError(message);
        return;
      }

      form.reset(REGISTER_DEFAULT_VALUES);

      return { success: true, message: messages.success.registerPending };
    } catch {
      const message = messages.errors.registerError;
      setRegisterError(message);
      return { success: false, message };
    } finally {
      netSubmittingRef.current = false;
    }
  };

  return {
    form,
    onSubmit,
    topError,
    dismissRegisterError,
    netSubmittingRef,
  };
}
