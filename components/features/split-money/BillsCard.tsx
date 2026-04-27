"use client";

import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt } from "lucide-react";
import type { IBill, IMember } from "./types";
import { CardCustom } from "@/components/ui/card-custom";
import { useI18n } from "@/context/i18n-context";
import { BillItem } from "./bills-card/BillItem";

interface BillsCardProps {
  bills: IBill[];
  members: IMember[];
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
            {t("common.bills")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground text-sm space-y-1">
            <Receipt className="h-10 w-10 mx-auto opacity-30 mb-2" />
            <p>{t("bills.noBills")}</p>
            <p className="text-xs">{t("bills.addHint")}</p>
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
          {t("common.bills")}
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
            {bills.map((bill) => (
              <BillItem
                key={bill.id}
                bill={bill}
                members={members}
                onRemove={onRemove}
                t={t}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </CardCustom>
  );
}
