"use client";

import { useI18n } from "@/context/i18n-context";
import { ScanBarcode } from "lucide-react";
import type { IMemberBillDetail } from "./types";
import { mergeBills } from "./member-bill-content/utils";
import { WIDTH, zigzagBottom, zigzagTop } from "./member-bill-receipt/utils";
import { Barcode } from "./member-bill-receipt/Barcode";
import { BillItem } from "./member-bill-receipt/BillItem";
import { ReceiptTotals } from "./member-bill-receipt/ReceiptTotals";
import { ReceiptBalance } from "./member-bill-receipt/ReceiptBalance";

interface IMemberBillReceiptProps {
  data: IMemberBillDetail;
  generatedAt?: string;
}

export function MemberBillReceipt({
  data,
  generatedAt,
}: IMemberBillReceiptProps) {
  const { t } = useI18n();
  const bills = mergeBills(data);

  const totalPaid = data.billsPaid.reduce((s, b) => s + b.totalAmount, 0);
  const totalUsed = data.billsUsed.reduce((s, b) => {
    const share = b.participantShares.find((p) => p.memberId === data.memberId);
    return s + (share?.amount ?? 0);
  }, 0);
  const balance = totalPaid - totalUsed;
  const isPositive = balance >= 0;

  const dateStr =
    generatedAt ??
    new Date().toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex justify-center py-6 min-h-screen">
      <div className="w-[340px]">
        {/* Top zigzag */}
        <svg
          width={WIDTH}
          height={12}
          viewBox={`0 0 ${WIDTH} 12`}
          preserveAspectRatio="none"
          className="block transform scale-y-[-1]"
        >
          <path d={zigzagTop()} className="fill-white" />
        </svg>

        <div className="bg-white border-x border-zinc-200 font-mono">
          {/* Brand header */}
          <div className="text-center px-6 py-5 border-b border-dashed border-zinc-200">
            <div className="text-[22px] font-medium tracking-[0.12em] text-zinc-900 font-sans uppercase">
              {t("common.appName")}
            </div>
            <div className="text-[9px] text-zinc-400 tracking-[0.18em] mt-1 uppercase font-sans">
              {t("receipt.appTagline")}
            </div>
          </div>

          {/* Meta row */}
          <div className="flex justify-between px-6 py-3 border-b border-dashed border-zinc-200 text-[11px]">
            <div>
              <div className="text-[9px] text-zinc-400 uppercase tracking-wide mb-0.5">
                {t("receipt.member")}
              </div>
              <div className="font-medium text-zinc-900">{data.memberName}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-zinc-400 uppercase tracking-wide mb-0.5">
                {t("receipt.date")}
              </div>
              <div className="font-medium text-zinc-900">
                {dateStr.split(",")[0]}
              </div>
            </div>
          </div>

          {/* Section label */}
          <div className="flex items-center gap-2 px-6 py-2">
            <span className="text-[9px] text-zinc-400 uppercase tracking-[0.15em] whitespace-nowrap">
              {t("receipt.billDetails")}
            </span>
            <span className="flex-1 border-t border-dashed border-zinc-200" />
            <span className="text-[9px] text-zinc-400">
              {bills.length} {t("receipt.items")}
            </span>
          </div>

          {/* Bill items */}
          {bills.map((bill) => (
            <BillItem
              key={bill.billId}
              bill={bill}
              memberId={data.memberId}
              memberName={data.memberName}
            />
          ))}

          <ReceiptTotals
            totalPaid={totalPaid}
            totalUsed={totalUsed}
            balance={balance}
            isPositive={isPositive}
          />

          <ReceiptBalance balance={balance} isPositive={isPositive} />

          {/* Footer */}
          <div className="px-6 py-4 text-center border-t border-dashed border-zinc-200">
            <div className="text-zinc-400 items-center text-center flex justify-center">
              <ScanBarcode />
            </div>
            <div className="text-[9px] text-zinc-400 tracking-wide mt-2 leading-relaxed">
              {t("common.appName").toUpperCase()}
              <br />
              {t("receipt.footerSlug")} · {dateStr}
              <br />
              {t("receipt.footerThanks")}
            </div>
          </div>
        </div>

        {/* Bottom zigzag */}
        <svg
          width={WIDTH}
          height={14}
          viewBox={`0 0 ${WIDTH} 14`}
          preserveAspectRatio="none"
          className="block transform scale-y-[-1]"
        >
          <path
            d={zigzagBottom()}
            className="fill-white stroke-zinc-200"
            strokeWidth={0.5}
          />
        </svg>
      </div>
    </div>
  );
}
