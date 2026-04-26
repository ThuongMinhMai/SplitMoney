"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Receipt,
  Trash2,
  Coffee,
  Car,
  Music,
  Beer,
  Utensils,
} from "lucide-react";
import { formatMoney, getBillIcon } from "./utils";
import type { Bill, Member } from "./types";
import { CardCustom } from "@/components/ui/card-custom";
import { useI18n } from "@/context/i18n-context";
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

const iconMap = {
  Coffee: Coffee,
  Car: Car,
  Music: Music,
  Beer: Beer,
  Utensils: Utensils,
  Receipt: Receipt,
};

interface BillsCardProps {
  bills: Bill[];
  members: Member[];
  onRemove: (id: string) => void;
}

export function BillsCard({ bills, members, onRemove }: BillsCardProps) {
  const { t } = useI18n();
  if (bills.length === 0) {
    return (
      <CardCustom className="shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <div className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Receipt className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            {t('common.bills')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground text-sm space-y-1">
            <Receipt className="h-10 w-10 mx-auto opacity-30 mb-2" />
            <p>{t('bills.noBills')}</p>
            <p className="text-xs">{t('bills.addHint')}</p>
          </div>
        </CardContent>
      </CardCustom>
    );
  }

  return (
    <CardCustom className="shadow-sm hover:shadow-md transition-all h-fit flex flex-col">
      <CardHeader className="pb-3 shrink-0">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <div className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
            <Receipt className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          {t('common.bills')}
          <Badge
            variant="secondary"
            className="ml-auto font-mono text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
          >
            {bills.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] overflow-hidden p-0">
        <div className="h-[400px] overflow-y-auto px-4 pb-4 custom-scrollbar">
          <div className="space-y-2 pr-3">
            {bills.map((bill) => {
              const payer = members.find((m) => m.id === bill.paidBy);
              const IconComponent =
                iconMap[getBillIcon(bill.name) as keyof typeof iconMap] ||
                Receipt;
              const participantNames = bill.participants
                .map((pid) => members.find((m) => m.id === pid)?.name)
                .filter(Boolean);

              return (
                <div
                  key={bill.id}
                  className="rounded-xl border bg-gradient-to-br from-card to-muted/20 p-3 group hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                        <IconComponent className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-medium text-sm truncate">
                        {bill.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                        {formatMoney(bill.totalAmount)}
                      </span>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('common.confirmDelete')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('common.deleteConfirmDesc')}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              {t('common.cancel')}
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                onRemove(bill.id);
                                toast.info(`${t('bills.removed')}: "${bill.name}"`);
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              {t('common.delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-2">
                    <span>
                      {t('bills.paidBy')}:{" "}
                      <span className="text-foreground font-medium">
                        {payer?.name}
                      </span>
                    </span>
                    <span>
                      {t('bills.splitType')}:{" "}
                      <span className="text-foreground">
                        {bill.splitType === "equal" ? t('bills.splitEqual') : t('bills.splitCustom')}
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
            })}
          </div>
        </div>
      </CardContent>
    </CardCustom>
  );
}
