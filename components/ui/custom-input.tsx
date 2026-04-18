import * as React from "react";
import { cn } from "@/lib/utils";

interface CustomInputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "sm" | "lg";
  focusRing?: "none" | "thin" | "normal";
}

function CustomInput({
  className,
  type,
  variant = "default",
  focusRing = "thin",
  ...props
}: CustomInputProps) {
  const variants = {
    sm: "h-7 text-xs px-2",
    default: "h-8 text-sm px-2.5",
    lg: "h-10 text-base px-3",
  };

  const focusRings = {
    none: "focus-visible:ring-0 focus-visible:border-ring",
    thin: "focus-visible:ring-1 focus-visible:ring-ring/50",
    normal: "focus-visible:ring-2 focus-visible:ring-ring/50",
  };

  return (
    <input
      type={type}
      data-slot="custom-input"
      className={cn(
        "w-full min-w-0 rounded-lg border border-input bg-transparent transition-all outline-none",
        "file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed",
        "disabled:bg-input/50 disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        "dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        variants[variant],
        focusRings[focusRing],
        className,
      )}
      {...props}
    />
  );
}

export { CustomInput };
