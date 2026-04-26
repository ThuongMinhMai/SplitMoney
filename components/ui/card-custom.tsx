import * as React from "react";
import { cn } from "@/lib/utils";

const CardCustom = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl py-4 border border-emerald-200/50 bg-white text-card-foreground shadow-sm hover:shadow-md transition-all",
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
