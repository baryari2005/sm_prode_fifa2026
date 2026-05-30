import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "border border-[#E7B03A] bg-[#FAB438] text-[#1E2C46] shadow-[0_14px_34px_rgba(250,180,56,0.28)] hover:bg-[#F7C45A] hover:shadow-[0_18px_40px_rgba(250,180,56,0.34)] focus-visible:ring-[#FAB438]/35",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-slate-300/80 bg-slate-100/90 text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)] hover:bg-slate-200 hover:text-slate-900 dark:border-slate-600/70 dark:bg-slate-800/85 dark:text-slate-100 dark:hover:bg-slate-700/90",
        secondary:
          "border border-slate-300/90 bg-slate-200 text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.08)] hover:bg-slate-300 dark:border-slate-600/80 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600",
        ghost:
          "hover:bg-white/[0.06] hover:text-sky-100 dark:hover:bg-white/[0.06]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
