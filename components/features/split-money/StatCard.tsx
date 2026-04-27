import { CardContent, CardCustom } from "@/components/ui/card-custom";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  valueClass?: string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, valueClass, icon }: StatCardProps) {
  return (
    <CardCustom>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </p>
          {icon && <div className="text-emerald-600">{icon}</div>}
        </div>
        <p
          className={cn(
            "text-2xl font-bold font-mono tracking-tight",
            valueClass,
          )}
        >
          {value}
        </p>
      </CardContent>
    </CardCustom>
  );
}
