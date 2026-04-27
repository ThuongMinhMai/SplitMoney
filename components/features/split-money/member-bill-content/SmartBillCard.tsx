import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Crown,
  Split,
  User,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";
import type { ISmartBill } from "../types";
import { formatMoneyFull } from "../utils";

interface SmartBillCardProps {
  bill: ISmartBill;
  memberId: string;
  getBillIcon: (billName: string) => any;
}

export function SmartBillCard({
  bill,
  memberId,
  getBillIcon,
}: SmartBillCardProps) {
  const BillIcon = getBillIcon(bill.billName);
  const isPayer = bill.paidBy === memberId;
  const myShare =
    bill.participantShares.find((s) => s.memberId === memberId)?.amount || 0;
  const isSettled = isPayer && myShare === bill.totalAmount; // Trả full, không cần ai trả lại

  // Tính toán trạng thái
  let roleIcon = null;
  let roleText = "";
  let roleColor = "";

  if (
    isPayer &&
    bill.participantShares.length > 1 &&
    myShare < bill.totalAmount
  ) {
    // Vừa trả vừa tham gia (phổ biến)
    roleIcon = <Split className="h-3 w-3" />;
    roleText = "Bạn trả thay - Đã bao gồm phần của bạn";
    roleColor = "text-purple-600";
  } else if (isPayer && myShare === bill.totalAmount) {
    // Trả full, không dùng
    roleIcon = <Crown className="h-3 w-3" />;
    roleText = "Bạn trả toàn bộ - Miễn phần của bạn";
    roleColor = "text-emerald-600 ";
  } else if (isPayer) {
    // Chỉ trả, không dùng
    roleIcon = <UserCheck className="h-3 w-3" />;
    roleText = "Bạn trả thay - Không tham gia";
    roleColor = "text-emerald-600";
  } else {
    // Chỉ tham gia
    roleIcon = <User className="h-3 w-3" />;
    roleText = `Bạn tham gia - Người trả: ${bill.paidByName}`;
    roleColor = "text-amber-600";
  }

  return (
    <div className="border rounded-xl border-zinc-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all">
      <div className="p-3 pb-2 border-b border-dashed border-zinc-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            <BillIcon className="h-4 w-4 text-zinc-500 shrink-0" />
            <div>
              <p className="font-semibold text-sm text-zinc-900">
                {bill.billName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div
                  className={cn(
                    "flex items-center gap-1 text-[9px]",
                    roleColor,
                  )}
                >
                  {roleIcon}
                  <span className="tracking-tight">{roleText}</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm font-bold font-mono text-zinc-900">
            {formatMoneyFull(bill.totalAmount)}
          </p>
        </div>
      </div>
      <div className="p-3">
        {myShare > 0 && (
          <div
            className={cn(
              "mb-2 p-2 rounded-lg text-[11px] flex justify-between items-center",
              isPayer
                ? "bg-emerald-50 border border-emerald-200"
                : "bg-amber-50 border border-amber-200",
            )}
          >
            <span className="flex items-center gap-1.5">
              {isPayer ? (
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              ) : (
                <Wallet className="h-3 w-3 text-amber-600" />
              )}
              <span className="font-medium text-black">
                {isPayer ? "Phần của bạn (đã trả)" : "Phần của bạn (cần trả)"}
              </span>
            </span>
            <span className="font-mono font-bold">
              {formatMoneyFull(myShare)}
            </span>
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-[9px] text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Users className="h-2.5 w-2.5" />
            THAM GIA ({bill.participantShares.length} người)
          </p>
          {bill.participantShares.map((share) => {
            const isSelf = share.memberId === memberId;
            const isPayerOfBill = share.memberId === bill.paidBy;

            return (
              <div
                key={share.memberId}
                className={cn(
                  "flex justify-between items-center text-[10px] py-1 px-1.5 rounded transition-colors",
                  isSelf && "bg-purple-50",
                )}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold",
                      isSelf
                        ? "bg-purple-200 text-purple-800"
                        : isPayerOfBill
                          ? "bg-emerald-200 text-emerald-800"
                          : "bg-zinc-100 text-zinc-600",
                    )}
                  >
                    {isSelf ? "B" : share.memberName.charAt(0)}
                  </span>
                  <span
                    className={cn(
                      "truncate max-w-[120px] text-black",
                      isSelf && "font-semibold text-purple-700",
                    )}
                  >
                    {share.memberName}
                    {isSelf && " (bạn)"}
                    {isPayerOfBill && !isSelf && " (người trả)"}
                  </span>
                </div>
                <span className="font-mono text-[10px]">
                  {formatMoneyFull(share.amount)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-2 pt-2 border-t border-dashed border-zinc-100 text-[9px]">
          {isPayer && myShare < bill.totalAmount && (
            <div className="flex justify-between text-emerald-700">
              <span>↻ Người khác trả lại bạn:</span>
              <span className="font-mono">
                {formatMoneyFull(bill.totalAmount - myShare)}
              </span>
            </div>
          )}
          {!isPayer && myShare > 0 && (
            <div className="flex justify-between text-amber-700">
              <span>→ Bạn cần trả:</span>
              <span className="font-mono">{formatMoneyFull(myShare)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
