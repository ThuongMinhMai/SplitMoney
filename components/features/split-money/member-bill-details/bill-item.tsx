"use client";

import { Badge } from "@/components/ui/badge";
import { User, UserCheck, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMoneyFull } from "../utils";
import type { IBillDetail } from "../types";
import { useI18n } from "@/context/i18n-context";

interface BillItemProps {
  bill: IBillDetail;
  memberId: string;
  type: "paid" | "used";
}

export function BillItem({ bill, memberId, type }: BillItemProps) {
  const { t } = useI18n();
  const isSelfPayer = bill.paidBy === memberId;
  const userShare = bill.participantShares.find((s) => s.memberId === memberId);

  if (type === "paid") {
    return (
      <div className="rounded-lg bg-muted/30 p-3 relative">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-medium text-sm">{bill.billName}</p>
            <p className="text-xs text-muted-foreground">
              {t("bills.total")}: {formatMoneyFull(bill.totalAmount)}
            </p>
          </div>
          <div className="flex gap-2">
            {isSelfPayer && (
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 h-5 text-[10px] border-none">
                <UserCheck className="h-3 w-3 mr-1" />
                {t("bills.selfPaid")}
              </Badge>
            )}
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 h-5 text-[10px] border-none">
              {t("bills.paid")}
            </Badge>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t">
          <p className="text-xs font-medium text-muted-foreground mb-1">
            {t("bills.shareFor")}:
          </p>
          <div className="space-y-1">
            {bill.participantShares.map((share) => {
              const isSelf = share.memberId === memberId;
              return (
                <div
                  key={share.memberId}
                  className={cn(
                    "flex justify-between items-center text-[11px] py-1 transition-colors border-l-2 pl-2",
                    isSelf
                      ? "border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold"
                      : "border-transparent text-muted-foreground dark:text-gray-400",
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <User
                      className={cn(
                        "h-3 w-3",
                        isSelf
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "opacity-50",
                      )}
                    />
                    <span className="truncate max-w-[100px] sm:max-w-none">
                      {share.memberName}
                    </span>
                    {isSelf && (
                      <span className="text-[8px] uppercase tracking-tighter opacity-70">
                        {t("bills.you")}
                      </span>
                    )}
                  </span>
                  <span
                    className={cn(
                      "font-mono",
                      isSelf ? "opacity-100" : "opacity-80",
                    )}
                  >
                    {formatMoneyFull(share.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-muted/30 p-3 relative">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-medium text-sm">{bill.billName}</p>
          <p className="text-xs text-muted-foreground">
            {t("bills.paidBy")}: {bill.paidByName}
            {isSelfPayer && (
              <span className="ml-1 text-emerald-600 dark:text-emerald-400">
                ({t("bills.you")})
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {isSelfPayer && (
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 h-5 text-[10px] border-none">
              <UserCheck className="h-3 w-3 mr-1" />
              {t("bills.selfUsed")}
            </Badge>
          )}
          <Badge
            variant="outline"
            className="text-amber-600 dark:text-amber-400 h-5 text-[10px] border-amber-200 dark:border-amber-500/30"
          >
            {t("bills.used")}
          </Badge>
        </div>
      </div>
      {userShare && (
        <div className="mt-2 pt-2 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("bills.mustPay")}:</span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded">
              {formatMoneyFull(userShare.amount)}
            </span>
          </div>
          {isSelfPayer && (
            <div className="mt-2 pt-2 border-t border-dashed">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <UserCheck className="h-3 w-3" />
                {t("bills.alreadyPaidHint")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
