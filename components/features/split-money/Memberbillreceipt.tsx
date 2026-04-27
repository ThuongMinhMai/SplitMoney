"use client";

import { useI18n } from "@/context/i18n-context";
import { cn } from "@/lib/utils";
import { ScanBarcode } from "lucide-react";
import type { IMemberBillDetail, ISmartBill } from "./types";
import { formatMoneyFull } from "./utils";

interface IMemberBillReceiptProps {
  data: IMemberBillDetail;
  generatedAt?: string;
}

function mergeBills(data: IMemberBillDetail): ISmartBill[] {
  const map = new Map<string, ISmartBill>();

  for (const b of data.billsPaid) {
    map.set(b.billId, {
      billId: b.billId,
      billName: b.billName,
      totalAmount: b.totalAmount,
      paidBy: b.paidBy,
      paidByName: b.paidByName,
      participantShares: [...b.participantShares],
    });
  }

  for (const b of data.billsUsed) {
    if (!map.has(b.billId)) {
      map.set(b.billId, {
        billId: b.billId,
        billName: b.billName,
        totalAmount: b.totalAmount,
        paidBy: b.paidBy,
        paidByName: b.paidByName,
        participantShares: b.participantShares,
      });
    }
  }

  return Array.from(map.values());
}

const TOOTH = 8.5;
const WIDTH = 340;
const TEETH = Math.floor(WIDTH / TOOTH);

function zigzagTop() {
  const pts = [`M0,0 L0,12`];
  for (let i = 0; i <= TEETH; i++) {
    const x = i * TOOTH;
    pts.push(`L${x},${i % 2 === 0 ? 6 : 12}`);
  }
  pts.push(`L${WIDTH},12 L${WIDTH},0 Z`);
  return pts.join(" ");
}

function zigzagBottom() {
  const pts = [`M0,0`];
  for (let i = 0; i <= TEETH; i++) {
    const x = i * TOOTH;
    pts.push(`L${x},${i % 2 === 0 ? 6 : 0}`);
  }
  pts.push(`L${WIDTH},14 L0,14 Z`);
  return pts.join(" ");
}

function Dot({ variant }: { variant: "me" | "payer" | "other" }) {
  return (
    <span
      className={cn(
        "inline-block w-[5px] h-[5px] rounded-full shrink-0 mr-1.5",
        variant === "me" && "bg-[#534AB7]",
        variant === "payer" && "bg-[#3B6D11]",
        variant === "other" && "bg-zinc-300",
      )}
    />
  );
}

function BillItem({
  bill,
  memberId,
  memberName,
}: {
  bill: ISmartBill;
  memberId: string;
  memberName: string;
}) {
  const { t } = useI18n();
  const isPayer = bill.paidBy === memberId;
  const myShare =
    bill.participantShares.find((s) => s.memberId === memberId)?.amount ?? 0;
  const othersTotal = bill.totalAmount - myShare;

  return (
    <div className="px-6 py-3 border-b border-zinc-100 last:border-b-0">
      <div className="flex justify-between items-start gap-2">
        <span className="text-[13px] font-medium text-zinc-900 font-sans leading-tight flex-1">
          {bill.billName}
        </span>
        <span className="text-[13px] font-medium font-mono text-zinc-900 whitespace-nowrap">
          {formatMoneyFull(bill.totalAmount)}
        </span>
      </div>

      <div className="mt-1">
        <span className="inline-flex items-center text-[9px] font-medium px-1.5 py-0.5 rounded-sm bg-zinc-100 text-zinc-500 tracking-wide font-sans">
          {isPayer
            ? t("receipt.youPaid")
            : t("receipt.paidBy").replace("{{name}}", bill.paidByName)}
        </span>
      </div>

      <div className="mt-2 pt-2 border-t border-dotted border-zinc-200">
        <div
          className={cn(
            "flex justify-between items-center text-[11px] font-medium font-sans px-2 py-1 rounded-sm mb-2",
            isPayer
              ? "bg-[#EAF3DE] text-[#27500A]"
              : "bg-[#FAEEDA] text-[#633806]",
          )}
        >
          <span>{t("receipt.yourShare")}</span>
          <span className="font-mono">{formatMoneyFull(myShare)}</span>
        </div>

        {bill.participantShares.map((s) => {
          const isMe = s.memberId === memberId;
          const isPayer_ = s.memberId === bill.paidBy;
          return (
            <div
              key={s.memberId}
              className={cn(
                "flex items-center text-[11px] py-0.5",
                isMe ? "text-zinc-900 font-medium" : "text-zinc-500",
              )}
            >
              <Dot
                variant={isMe ? "me" : isPayer_ && !isMe ? "payer" : "other"}
              />
              <span className="flex-1">
                {isMe
                  ? t("receipt.youLabel").replace("{{name}}", s.memberName)
                  : s.memberName}
                {isPayer_ && !isMe && (
                  <span className="text-[9px] text-zinc-400 ml-1">
                    ({t("receipt.payer")})
                  </span>
                )}
              </span>
              <span className="font-mono text-[11px]">
                {formatMoneyFull(s.amount)}
              </span>
            </div>
          );
        })}

        <div
          className={cn(
            "flex justify-between text-[10px] pt-1.5 mt-1.5 border-t border-dotted border-zinc-200",
            isPayer ? "text-[#27500A]" : "text-[#854F0B]",
          )}
        >
          {isPayer ? (
            <>
              <span>{t("receipt.theyOweYou")}</span>
              <span className="font-mono">
                + {formatMoneyFull(othersTotal)}
              </span>
            </>
          ) : (
            <>
              <span>
                {t("receipt.youOwe").replace("{{name}}", bill.paidByName)}
              </span>
              <span className="font-mono">− {formatMoneyFull(myShare)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const BAR_PATTERN = [2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2];

function Barcode() {
  let x = 0;
  return (
    <svg
      width="80"
      height="20"
      viewBox="0 0 80 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      {BAR_PATTERN.map((w, i) => {
        const bar = (
          <rect
            key={i}
            x={x}
            y={0}
            width={w}
            height={20}
            fill={i % 2 === 0 ? "currentColor" : "transparent"}
          />
        );
        x += w + 1;
        return bar;
      })}
    </svg>
  );
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
    <div className="flex justify-center p-6 min-h-screen">
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

          {/* Totals */}
          <div className="px-6 py-3 border-t border-dashed border-zinc-200 text-[12px]">
            <div className="flex justify-between py-0.5 text-zinc-500">
              <span>{t("receipt.totalYouPaid")}</span>
              <span className="font-mono">{formatMoneyFull(totalPaid)}</span>
            </div>
            <div className="flex justify-between py-0.5 text-zinc-500">
              <span>{t("receipt.totalYouUsed")}</span>
              <span className="font-mono">{formatMoneyFull(totalUsed)}</span>
            </div>
            <div className="flex justify-between py-2 mt-2 border-t border-zinc-300 text-[14px] font-medium text-zinc-900">
              <span>{t("receipt.balance")}</span>
              <span
                className={cn(
                  "font-mono",
                  isPositive ? "text-[#27500A]" : "text-[#791F1F]",
                )}
              >
                {isPositive ? "+" : "−"} {formatMoneyFull(Math.abs(balance))}
              </span>
            </div>
          </div>

          {/* Balance block */}
          <div
            className={cn(
              "mx-6 mb-4 p-4 rounded-sm text-center border",
              isPositive
                ? "bg-[#EAF3DE] border-[#C0DD97]"
                : "bg-[#FCEBEB] border-[#F7C1C1]",
            )}
          >
            <div
              className={cn(
                "text-[9px] uppercase tracking-[0.15em] mb-1 font-sans",
                isPositive ? "text-[#27500A]" : "text-[#791F1F]",
              )}
            >
              {isPositive
                ? t("receipt.groupOwesYou")
                : t("receipt.youOweGroup")}
            </div>
            <div
              className={cn(
                "text-[26px] font-medium font-mono",
                isPositive ? "text-[#27500A]" : "text-[#791F1F]",
              )}
            >
              {formatMoneyFull(Math.abs(balance))}
            </div>
            <div
              className={cn(
                "text-[10px] mt-1 font-sans",
                isPositive ? "text-[#3B6D11]" : "text-[#A32D2D]",
              )}
            >
              {isPositive
                ? t("receipt.balancePositiveHint")
                : t("receipt.balanceNegativeHint")}
            </div>
          </div>

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
