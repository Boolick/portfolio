import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-none border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-1 focus:ring-ring",
  {
    variants: {
      variant: {
        default: "border-border bg-primary text-primary-foreground",
        secondary: "border-border bg-secondary text-secondary-foreground",
        destructive: "border-destructive bg-destructive/10 text-destructive",
        outline: "border-border bg-card text-foreground",
        statusOk: "border-status-ok bg-status-ok/10 text-status-ok",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
