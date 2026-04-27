"use client";

import { Badge } from "@/components/ui/badge";
import { QrCode, Receipt, RefreshCw } from "lucide-react";
import { Avatar } from "./Avatar";
import type { IMemberBillDetail } from "./types";
import { getBillIcon, mergeBills } from "./member-bill-content/utils";
import { SmartBillCard } from "./member-bill-content/SmartBillCard";
import { BalanceSummary } from "./member-bill-content/BalanceSummary";

interface MemberBillContentProps {
  data: IMemberBillDetail;
  generatedAt?: string;
}

export function MemberBillContent({
  data,
  generatedAt,
}: MemberBillContentProps) {
  const totalPaid = data.billsPaid.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalUsed = data.billsUsed.reduce((sum, b) => {
    const share = b.participantShares.find((s) => s.memberId === data.memberId);
    return sum + (share?.amount || 0);
  }, 0);
  const balance = totalPaid - totalUsed;
  const isPositive = balance >= 0;

  const mergedBills = mergeBills(data);

  const dateStr =
    generatedAt ||
    new Date().toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="w-full max-w-md mx-auto font-mono">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200">
        {/* Header */}
        <div className="text-center pt-8 pb-4 border-b border-dashed border-zinc-200">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-3">
            <Receipt className="h-6 w-6 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold tracking-wide text-zinc-900">
            SPLIT MONEY
          </h1>
          <p className="text-[10px] text-zinc-400 tracking-wider mt-0.5">
            TRANG WEB CHIA TIỀN THÔNG MINH
          </p>
        </div>

        {/* Customer Info */}
        <div className="px-5 py-4 border-b border-dashed border-zinc-200 bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <Avatar name={data.memberName} size="md" />
            <div className="flex-1">
              <p className="text-[10px] text-zinc-400 tracking-wide">
                THÀNH VIÊN
              </p>
              <p className="font-bold text-zinc-900">{data.memberName}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-zinc-400">NGÀY</p>
              <p className="text-xs font-mono text-zinc-700">
                {dateStr.split(",")[0]}
              </p>
            </div>
          </div>
        </div>

        {/* Balance Summary */}
        <BalanceSummary
          totalPaid={totalPaid}
          totalUsed={totalUsed}
          balance={balance}
          isPositive={isPositive}
        />

        {/* SMART BILLS SECTION - Merged view */}
        <div className="px-5 py-3">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw className="h-3.5 w-3.5 text-purple-500" />
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-700">
              TẤT CẢ HÓA ĐƠN
            </p>
            <Badge className="ml-auto bg-purple-100 text-purple-700 text-[9px]">
              {mergedBills.length} hóa đơn
            </Badge>
          </div>

          <div className="space-y-4">
            {mergedBills.map((bill) => (
              <SmartBillCard
                key={bill.billId}
                bill={bill}
                memberId={data.memberId}
                getBillIcon={getBillIcon}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 text-center border-t border-dashed border-zinc-200">
          <div className="flex justify-center gap-1 mb-3">
            <div className="w-8 h-8 bg-zinc-100 rounded flex items-center justify-center">
              <QrCode className="h-4 w-4 text-zinc-400" />
            </div>
          </div>
          <p className="text-[8px] text-zinc-400 mt-1">
            Hóa đơn được tạo tự động bởi Split Money Pro
          </p>
        </div>
      </div>
    </div>
  );
}
