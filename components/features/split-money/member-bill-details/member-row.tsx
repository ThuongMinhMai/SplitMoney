"use client";

import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/context/i18n-context";
import { ChevronDown, ChevronUp, Eye, Receipt, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar } from "../Avatar";
import type { IMemberBillDetail } from "../types";
import { formatMoneyFull } from "../utils";
import { BillItem } from "./bill-item";

interface MemberRowProps {
  member: IMemberBillDetail;
  isExpanded: boolean;
  onToggle: () => void;
}

export function MemberRow({ member, isExpanded, onToggle }: MemberRowProps) {
  const { t } = useI18n();
  const totalPaid = member.billsPaid.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalUsed = member.billsUsed.reduce((sum, b) => {
    const share = b.participantShares.find(
      (s) => s.memberId === member.memberId,
    );
    return sum + (share?.amount || 0);
  }, 0);

  const router = useRouter();

  const handleViewBill = (e: React.MouseEvent) => {
    e.stopPropagation();
    const dataString = JSON.stringify({
      memberDetail: member,
      generatedAt: new Date().toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    // safe btoa for unicode
    const data = btoa(unescape(encodeURIComponent(dataString)));
    router.push(`/member/${member.memberId}/bill?data=${data}`);
  };

  return (
    <div className="rounded-xl border bg-gradient-to-br from-card to-muted/20 overflow-hidden">
      <div
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Avatar name={member.memberName} size="md" />
          <div className="text-left">
            <h3 className="font-semibold text-sm">{member.memberName}</h3>
            <p className="text-xs text-muted-foreground">
              {t("summary.paid")}: {formatMoneyFull(totalPaid)} •{" "}
              {t("summary.used")}: {formatMoneyFull(totalUsed)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-[10px] h-5 hidden sm:inline-flex"
          >
            {member.billsPaid.length} {t("details.paidItems")}
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] h-5 hidden sm:inline-flex"
          >
            {member.billsUsed.length} {t("details.usedItems")}
          </Badge>
          <button
            onClick={handleViewBill}
            className="p-1.5 hover:bg-muted rounded-md transition-colors text-emerald-600 dark:text-emerald-400"
            title="Xem sao kê cá nhân"
          >
            <Eye className="h-4 w-4" />
          </button>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t p-4 space-y-6 animate-in slide-in-from-top-2 duration-200">
          {member.billsPaid.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                <div className="p-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30">
                  <Receipt className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                {t("details.paidItems")}
              </h4>
              <div className="space-y-2">
                {member.billsPaid.map((bill) => (
                  <BillItem
                    key={bill.billId}
                    bill={bill}
                    memberId={member.memberId}
                    type="paid"
                  />
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
                {t("details.usedItems")}
              </h4>
              <div className="space-y-2">
                {member.billsUsed.map((bill) => (
                  <BillItem
                    key={bill.billId}
                    bill={bill}
                    memberId={member.memberId}
                    type="used"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
