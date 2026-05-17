"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useLogin } from "../../hooks/useLogin";
import { useRegister } from "../../hooks/useRegister";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";

import { AccessRequestDialog } from "./AccessRequestDialog";
import { AuthCard } from "./AuthCard";
import { LoginHeroSection } from "./LoginHeroSection";
import { LoginMascotSection } from "./LoginMascotSection";
import { LoginPageLayout } from "./LoginPageLayout";

type Props = {
  nextParam?: string;
};

export default function LoginForm({ nextParam }: Props) {
  const {
    form: loginForm,
    onSubmit,
    topError,
    dismissTopError,
    netSubmittingRef,
    triedMe,
    token,
    user,
  } = useLogin();

  const {
    form: registerForm,
    onSubmit: onRegisterSubmit,
    topError: registerTopError,
    dismissRegisterError,
    netSubmittingRef: registerNetSubmittingRef,
  } = useRegister();

  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);

  useAuthRedirect({
    triedMe,
    token,
    user,
    nextParam,
  });

  type RegisterSubmitValues = Parameters<typeof onRegisterSubmit>[0];

  const handleRegisterSubmit = async (values: RegisterSubmitValues) => {
    const result = await onRegisterSubmit(values);

    if (result?.success) {
      toast.success(
        result.message ??
          "Solicitud enviada. Un administrador deberá aprobar tu usuario."
      );

      setIsAccessDialogOpen(false);
    }
  };

  const isLoginLoading =
    loginForm.formState.isSubmitting || netSubmittingRef.current;

  const isRegisterLoading =
    registerForm.formState.isSubmitting || registerNetSubmittingRef.current;

  return (
    <LoginPageLayout
      hero={<LoginHeroSection />}
      mascot={<LoginMascotSection />}
      auth={
        <>
          <AuthCard
            loginForm={loginForm}
            onLoginSubmit={onSubmit}
            topError={topError}
            onDismissTopError={dismissTopError}
            isLoading={isLoginLoading}
            onOpenAccessRequest={() => setIsAccessDialogOpen(true)}
          />

          <AccessRequestDialog
            open={isAccessDialogOpen}
            onOpenChange={setIsAccessDialogOpen}
            registerForm={registerForm}
            onRegisterSubmit={handleRegisterSubmit}
            registerTopError={registerTopError}
            onDismissRegisterError={dismissRegisterError}
            isLoading={isRegisterLoading}
          />
        </>
      }
    />
  );
}
