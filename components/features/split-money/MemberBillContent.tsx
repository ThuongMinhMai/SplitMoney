"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar } from "./Avatar";
import { formatMoneyFull } from "./utils";
import type { MemberBillDetail } from "./types";
import {
  Receipt,
  TrendingUp,
  TrendingDown,
  User,
  UserCheck,
  Wallet,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MemberBillContentProps {
  data: MemberBillDetail;
  generatedAt?: string;
}

export function MemberBillContent({ data, generatedAt }: MemberBillContentProps) {
  const totalPaid = data.billsPaid.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalUsed = data.billsUsed.reduce((sum, b) => {
    const share = b.participantShares.find((s) => s.memberId === data.memberId);
    return sum + (share?.amount || 0);
  }, 0);
  const balance = totalPaid - totalUsed;
  const isPositive = balance >= 0;

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
    <div className="w-full max-w-lg mx-auto font-sans select-text">
      {/* ─── Header / Receipt Top ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 text-white shadow-xl">
        {/* decorative circles */}
        <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/10" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 opacity-80">
            <Receipt className="h-4 w-4" />
            <span className="text-xs font-medium tracking-widest uppercase">
              Sao kê cá nhân
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <Avatar name={data.memberName} size="lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight">
                {data.memberName}
              </h1>
              <div className="flex items-center gap-1.5 mt-1 text-emerald-100 text-xs">
                <CalendarDays className="h-3 w-3" />
                <span>{dateStr}</span>
              </div>
            </div>
          </div>

          {/* Balance summary row */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            <SummaryChip
              label="Đã ứng"
              value={formatMoneyFull(totalPaid)}
              icon={<TrendingUp className="h-3.5 w-3.5" />}
              color="emerald"
            />
            <SummaryChip
              label="Đã dùng"
              value={formatMoneyFull(totalUsed)}
              icon={<TrendingDown className="h-3.5 w-3.5" />}
              color="amber"
            />
            <SummaryChip
              label={isPositive ? "Được nhận" : "Phải trả"}
              value={formatMoneyFull(Math.abs(balance))}
              icon={<Wallet className="h-3.5 w-3.5" />}
              color={isPositive ? "sky" : "rose"}
            />
          </div>
        </div>
      </div>

      {/* ─── Dashed divider "receipt tear" ─── */}
      <div className="flex items-center gap-1 px-2 -my-px">
        <div className="h-4 w-4 rounded-full bg-background border border-border/60 shrink-0" />
        <div className="flex-1 border-t-2 border-dashed border-border/50" />
        <div className="h-4 w-4 rounded-full bg-background border border-border/60 shrink-0" />
      </div>

      {/* ─── Bills Paid ─── */}
      {data.billsPaid.length > 0 && (
        <section className="mt-3 px-1">
          <SectionHeader
            icon={<Receipt className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
            title="Khoản đã trả thay"
            count={data.billsPaid.length}
            colorClass="text-emerald-600 dark:text-emerald-400"
            bgClass="bg-emerald-50 dark:bg-emerald-900/20"
          />
          <div className="space-y-3 mt-3">
            {data.billsPaid.map((bill) => (
              <PaidBillCard
                key={bill.billId}
                bill={bill}
                memberId={data.memberId}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── Bills Used ─── */}
      {data.billsUsed.length > 0 && (
        <section className="mt-5 px-1">
          <SectionHeader
            icon={<User className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
            title="Khoản đã tham gia"
            count={data.billsUsed.length}
            colorClass="text-amber-600 dark:text-amber-400"
            bgClass="bg-amber-50 dark:bg-amber-900/20"
          />
          <div className="space-y-3 mt-3">
            {data.billsUsed.map((bill) => {
              const share = bill.participantShares.find(
                (s) => s.memberId === data.memberId
              );
              return (
                <UsedBillCard
                  key={bill.billId}
                  bill={bill}
                  memberId={data.memberId}
                  myShare={share?.amount || 0}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* ─── Footer ─── */}
      <div className="mt-5 px-1 mb-2">
        <div
          className={cn(
            "rounded-xl p-4 flex items-center justify-between",
            isPositive
              ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40"
              : "bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/40"
          )}
        >
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              Kết quả cuối cùng
            </p>
            <p
              className={cn(
                "text-base font-bold mt-0.5",
                isPositive
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-rose-700 dark:text-rose-400"
              )}
            >
              {isPositive
                ? `Được nhận lại ${formatMoneyFull(balance)}`
                : `Cần chuyển ${formatMoneyFull(Math.abs(balance))}`}
            </p>
          </div>
          <div
            className={cn(
              "rounded-full p-2",
              isPositive
                ? "bg-emerald-100 dark:bg-emerald-800/30"
                : "bg-rose-100 dark:bg-rose-800/30"
            )}
          >
            {isPositive ? (
              <TrendingUp
                className={cn(
                  "h-5 w-5",
                  "text-emerald-600 dark:text-emerald-400"
                )}
              />
            ) : (
              <ArrowRight className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            )}
          </div>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-3 opacity-60 tracking-wide">
          Split Money Pro • {dateStr}
        </p>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function SummaryChip({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: "emerald" | "amber" | "sky" | "rose";
}) {
  const colorMap = {
    emerald: "bg-emerald-500/20 text-emerald-100",
    amber: "bg-amber-500/20 text-amber-100",
    sky: "bg-sky-500/20 text-sky-100",
    rose: "bg-rose-500/20 text-rose-100",
  };
  return (
    <div className={cn("rounded-xl p-2.5 text-center", colorMap[color])}>
      <div className="flex justify-center mb-1 opacity-80">{icon}</div>
      <p className="text-[10px] opacity-70 mb-0.5">{label}</p>
      <p className="text-[11px] font-bold leading-tight break-all">{value}</p>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  count,
  colorClass,
  bgClass,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  colorClass: string;
  bgClass: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("rounded-lg p-1.5", bgClass)}>{icon}</div>
      <span className={cn("text-sm font-semibold", colorClass)}>{title}</span>
      <span className="ml-auto text-[11px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">
        {count}
      </span>
    </div>
  );
}

function PaidBillCard({
  bill,
  memberId,
}: {
  bill: MemberBillDetail["billsPaid"][0];
  memberId: string;
}) {
  return (
    <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-card overflow-hidden shadow-sm">
      {/* top stripe */}
      <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />
      <div className="p-3">
        <div className="flex items-start justify-between mb-2.5">
          <div>
            <p className="font-semibold text-sm leading-tight">{bill.billName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tổng:{" "}
              <span className="font-mono font-medium">
                {formatMoneyFull(bill.totalAmount)}
              </span>
            </p>
          </div>
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-none text-[10px] shrink-0">
            Trả thay
          </Badge>
        </div>

        <div className="border-t pt-2 space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-1.5">
            Phân bổ
          </p>
          {bill.participantShares.map((share) => {
            const isSelf = share.memberId === memberId;
            return (
              <div
                key={share.memberId}
                className={cn(
                  "flex justify-between items-center text-[12px] py-1 px-2 rounded-lg transition-colors",
                  isSelf
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 font-semibold"
                    : "text-muted-foreground"
                )}
              >
                <span className="flex items-center gap-1.5">
                  {isSelf ? (
                    <UserCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <User className="h-3 w-3 opacity-50" />
                  )}
                  <span className="truncate max-w-[120px]">
                    {share.memberName}
                  </span>
                  {isSelf && (
                    <span className="text-[9px] bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-300 px-1 rounded uppercase tracking-tight">
                      bạn
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "font-mono",
                    isSelf
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "opacity-70"
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

function UsedBillCard({
  bill,
  memberId,
  myShare,
}: {
  bill: MemberBillDetail["billsUsed"][0];
  memberId: string;
  myShare: number;
}) {
  const isSelfPayer = bill.paidBy === memberId;

  return (
    <div className="rounded-xl border border-amber-100 dark:border-amber-900/30 bg-card overflow-hidden shadow-sm">
      {/* top stripe */}
      <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-400" />
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-semibold text-sm leading-tight">{bill.billName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Người trả:{" "}
              <span className="font-medium text-foreground">
                {bill.paidByName}
                {isSelfPayer && (
                  <span className="ml-1 text-emerald-600 dark:text-emerald-400 text-[11px]">
                    (bạn)
                  </span>
                )}
              </span>
            </p>
          </div>
          <Badge
            variant="outline"
            className="text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700/40 text-[10px] shrink-0"
          >
            Đã dùng
          </Badge>
        </div>

        <div className="border-t pt-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Phần của bạn</span>
            <span className="font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-lg text-sm">
              {formatMoneyFull(myShare)}
            </span>
          </div>
          {isSelfPayer && (
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-dashed">
              <UserCheck className="h-3 w-3 text-muted-foreground" />
              <p className="text-[11px] text-muted-foreground">
                Bạn đã trả khoản này, không cần chuyển tiền
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
