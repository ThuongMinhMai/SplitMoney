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
  Brush,
} from "lucide-react";
import { toast } from "sonner";
import type { IBill, IMember } from "../types";
import { formatMoneyFull, getBillIcon } from "../utils";

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
  onEdit: (bill: IBill) => void;
  t: (key: string) => string;
}

export function BillItem({
  bill,
  members,
  onRemove,
  onEdit,
  t,
}: IBillItemProps) {
  const payer = members.find((m) => m.id === bill.paidBy);
  const IconComponent = (iconMap[
    getBillIcon(bill.name) as keyof typeof iconMap
  ] || Receipt) as any;

  const participantNames = bill.participants
    .map((pid) => members.find((m) => m.id === pid)?.name)
    .filter(Boolean);

  return (
    <div className="rounded-xl border bg-gradient-to-br from-card to-muted/20 p-4 group hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
            <IconComponent className="h-5 w-5" />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm text-foreground truncate">
              {bill.name}
            </span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base">
              {formatMoneyFull(bill.totalAmount)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 ">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={() => onEdit(bill)}
            aria-label={t("common.edit")}
          >
            <Brush className="h-4 w-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
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
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {t("common.delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-col flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
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
          {participantNames.map((n, idx) => (
            <Badge
              key={`${n}-${idx}`}
              variant="secondary"
              className="text-[10px] h-5 px-1.5 bg-muted/50 font-normal"
            >
              {n}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
