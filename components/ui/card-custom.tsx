import * as React from "react";
import { cn } from "@/lib/utils";

const CardCustom = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-900/50 bg-card text-card-foreground shadow-sm hover:shadow-md transition-all",
      className,
    )}
    {...props}
  />
));
CardCustom.displayName = "CardCustom";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export { CardCustom, CardContent };
