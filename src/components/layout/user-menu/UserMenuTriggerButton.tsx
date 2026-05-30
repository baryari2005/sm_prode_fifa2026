"use client";

import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { UserAvatar } from "./UserAvatar";

type Props = {
  avatarUrl?: string;
  fullName?: string;
} & ComponentPropsWithoutRef<typeof Button>;

export const UserMenuTriggerButton = forwardRef<HTMLButtonElement, Props>(
  ({ avatarUrl, fullName, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        aria-label="Abrir menu de usuario"
        className={cn(
          "h-12 w-12 rounded-2xl border border-white/10 bg-white/[0.05] p-0 shadow-sm hover:bg-white/[0.1] data-[state=open]:bg-white/[0.1] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      >
        <UserAvatar
          src={avatarUrl}
          name={fullName}
          className="h-10 w-10 border-0 shadow-none"
        />
      </Button>
    );
  },
);

UserMenuTriggerButton.displayName = "UserMenuTriggerButton";
