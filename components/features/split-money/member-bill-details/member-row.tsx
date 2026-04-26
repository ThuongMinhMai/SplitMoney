"use client";

import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Receipt, User } from "lucide-react";
import { Avatar } from "../Avatar";
import { formatMoneyFull } from "../utils";
import { BillItem } from "./bill-item";
import type { MemberBillDetail } from "../types";
import { useI18n } from "@/context/i18n-context";

interface MemberRowProps {
  member: MemberBillDetail;
  isExpanded: boolean;
  onToggle: () => void;
}

export function MemberRow({ member, isExpanded, onToggle }: MemberRowProps) {
  const { t } = useI18n();
  const totalPaid = member.billsPaid.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalUsed = member.billsUsed.reduce((sum, b) => {
    const share = b.participantShares.find((s) => s.memberId === member.memberId);
    return sum + (share?.amount || 0);
  }, 0);

  return (
    <div className="rounded-xl border bg-gradient-to-br from-card to-muted/20 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Avatar name={member.memberName} size="md" />
          <div className="text-left">
            <h3 className="font-semibold text-sm">{member.memberName}</h3>
            <p className="text-xs text-muted-foreground">
              {t('summary.paid')}: {formatMoneyFull(totalPaid)} • {t('summary.used')}: {formatMoneyFull(totalUsed)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] h-5 hidden sm:inline-flex">
            {member.billsPaid.length} {t('details.paidItems')}
          </Badge>
          <Badge variant="outline" className="text-[10px] h-5 hidden sm:inline-flex">
            {member.billsUsed.length} {t('details.usedItems')}
          </Badge>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t p-4 space-y-6 animate-in slide-in-from-top-2 duration-200">
          {member.billsPaid.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                <div className="p-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30">
                  <Receipt className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                {t('details.paidItems')}
              </h4>
              <div className="space-y-2">
                {member.billsPaid.map((bill) => (
                  <BillItem key={bill.billId} bill={bill} memberId={member.memberId} type="paid" />
                ))}
              </div>
            </div>
          )}

          {member.billsUsed.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                <div className="p-0.5 rounded bg-amber-100 dark:bg-amber-500/10">
                  <User className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                </div>
                {t('details.usedItems')}
              </h4>
              <div className="space-y-2">
                {member.billsUsed.map((bill) => (
                  <BillItem key={bill.billId} bill={bill} memberId={member.memberId} type="used" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
