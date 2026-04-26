import { cn } from "@/lib/utils";
import { getInitials } from "./utils";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ name, size = "md" }: AvatarProps) {
  const sizes = {
    sm: "h-6 w-6 text-[9px]",
    md: "h-8 w-8 text-xs",
    lg: "h-10 w-10 text-sm",
  };
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-semibold shrink-0 shadow-sm",
        sizes[size],
      )}
    >
      {getInitials(name)}
    </div>
  );
}
