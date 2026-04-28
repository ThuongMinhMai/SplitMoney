import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Beer,
  Car,
  Coffee,
  Music,
  Receipt,
  Trash2,
  Utensils,
} from "lucide-react";
import { toast } from "sonner";
import type { IBill, IMember } from "../types";
import { formatMoneyFull, getBillIcon } from "../utils";
// import { formatMoney, getBillIcon } from "../utils";

const iconMap = {
  Coffee: Coffee,
  Car: Car,
  Music: Music,
  Beer: Beer,
  Utensils: Utensils,
  Receipt: Receipt,
};

interface IBillItemProps {
  bill: IBill;
  members: IMember[];
  onRemove: (id: string) => void;
  t: (key: string) => string;
}

export function BillItem({ bill, members, onRemove, t }: IBillItemProps) {
  const payer = members.find((m) => m.id === bill.paidBy);
  const IconComponent =
    iconMap[getBillIcon(bill.name) as keyof typeof iconMap] || Receipt;
  const participantNames = bill.participants
    .map((pid) => members.find((m) => m.id === pid)?.name)
    .filter(Boolean);

  return (
    <div className="rounded-xl border bg-gradient-to-br from-card to-muted/20 p-3 group hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
            <IconComponent className="h-3.5 w-3.5" />
          </div>
          <span className="font-medium text-sm truncate">{bill.name}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">
            {/* {formatMoney(bill.totalAmount)} */}
            {formatMoneyFull(bill.totalAmount)}
          </span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive bg-destructive/10 transition-all"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("common.confirmDelete")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("common.deleteConfirmDesc")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onRemove(bill.id);
                    toast.info(`${t("bills.removed")}: "${bill.name}"`);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {t("common.delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-2">
        <span>
          {t("bills.paidBy")}:{" "}
          <span className="text-foreground font-medium">{payer?.name}</span>
        </span>
        <span>
          {t("bills.splitType")}:{" "}
          <span className="text-foreground">
            {bill.splitType === "equal"
              ? t("bills.splitEqual")
              : t("bills.splitCustom")}
          </span>
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {participantNames.map((n) => (
          <Badge
            key={n}
            variant="secondary"
            className="text-[10px] h-5 px-1.5 bg-muted/50"
          >
            {n}
          </Badge>
        ))}
      </div>
    </div>
  );
}
