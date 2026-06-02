"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DialogShellProps = {
  children: ReactNode;
  className?: string;
};

type DialogHeroProps = {
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
  className?: string;
  iconClassName?: string;
};

type DialogHighlightCardProps = {
  icon?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

type DialogMutedNoteProps = {
  children: ReactNode;
  className?: string;
};

type DialogFormSectionProps = {
  children: ReactNode;
  className?: string;
};

export function DialogShell({ children, className }: DialogShellProps) {
  return (
    <div className={cn("overflow-hidden rounded-[1.75rem] bg-white", className)}>
      {children}
    </div>
  );
}

export function DialogHero({
  icon,
  title,
  description,
  className,
  iconClassName,
}: DialogHeroProps) {
  return (
    <div
      className={cn(
        "bg-gradient-to-br from-sky-500 via-cyan-600 to-slate-900 px-6 py-5 text-white",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20",
            iconClassName
          )}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <div className="text-xl font-black leading-tight text-white">{title}</div>
          <div className="mt-2 text-sm leading-5 text-white/80">{description}</div>
        </div>
      </div>
    </div>
  );
}

export function DialogFormSection({
  children,
  className,
}: DialogFormSectionProps) {
  return <div className={cn("space-y-4 px-6 py-5", className)}>{children}</div>;
}

export function DialogHighlightCard({
  icon,
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}: DialogHighlightCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-sky-100 bg-sky-50 px-4 py-4",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {icon ? <div className="mt-0.5 shrink-0">{icon}</div> : null}

        <div className="min-w-0">
          <p className={cn("text-sm font-black text-sky-950", titleClassName)}>
            {title}
          </p>
          <div
            className={cn(
              "mt-1 text-sm leading-5 text-sky-800",
              descriptionClassName
            )}
          >
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DialogMutedNote({
  children,
  className,
}: DialogMutedNoteProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3",
        className
      )}
    >
      <p className="text-sm font-semibold leading-5 text-white/75">
        {children}
      </p>
    </div>
  );
}