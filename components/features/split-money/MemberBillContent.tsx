"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Car,
  CheckCircle2,
  Coffee,
  Crown,
  Droplets,
  Film,
  Gift,
  Home,
  Plane,
  QrCode,
  Receipt,
  RefreshCw,
  Scissors,
  ShoppingBag,
  Smartphone,
  Split,
  User,
  UserCheck,
  Users,
  Utensils,
  Wallet,
  Zap,
} from "lucide-react";
import { Avatar } from "./Avatar";
import type { IMemberBillDetail, ISmartBill } from "./types";
import { formatMoneyFull } from "./utils";

interface MemberBillContentProps {
  data: IMemberBillDetail;
  generatedAt?: string;
}

const getBillIcon = (billName: string) => {
  const name = billName.toLowerCase();
  if (name.includes("ăn") || name.includes("cơm") || name.includes("nhà hàng"))
    return Utensils;
  if (name.includes("cafe") || name.includes("trà")) return Coffee;
  if (name.includes("mua") || name.includes("shop")) return ShoppingBag;
  if (name.includes("quà") || name.includes("tặng")) return Gift;
  if (name.includes("nhà") || name.includes("thuê")) return Home;
  if (name.includes("xe") || name.includes("taxi")) return Car;
  if (name.includes("phim") || name.includes("cinema")) return Film;
  if (name.includes("điện") || name.includes("thoại")) return Smartphone;
  if (name.includes("cắt") || name.includes("tóc")) return Scissors;
  if (name.includes("máy") || name.includes("bay")) return Plane;
  if (name.includes("nước") || name.includes("uống")) return Droplets;
  if (name.includes("điện")) return Zap;
  return Receipt;
};

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
        <div className="px-5 py-4 border-b border-dashed border-zinc-200">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-[10px] text-zinc-400 uppercase">
                Đã thanh toán
              </p>
              <p className="text-lg font-bold text-emerald-600">
                {formatMoneyFull(totalPaid)}
              </p>
              <p className="text-[9px] text-zinc-400 mt-0.5">cho nhóm</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-zinc-400 uppercase">Đã sử dụng</p>
              <p className="text-lg font-bold text-amber-600">
                {formatMoneyFull(totalUsed)}
              </p>
              <p className="text-[9px] text-zinc-400 mt-0.5">từ nhóm</p>
            </div>
          </div>

          <div
            className={cn(
              "mt-4 p-3 rounded-lg text-center",
              isPositive ? "bg-emerald-50" : "bg-rose-50",
            )}
          >
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">
              {isPositive ? "SỐ DƯ ĐƯỢC NHẬN" : "SỐ TIỀN CẦN THANH TOÁN"}
            </p>
            <p
              className={cn(
                "text-2xl font-bold mt-0.5",
                isPositive ? "text-emerald-600" : "text-rose-600",
              )}
            >
              {formatMoneyFull(Math.abs(balance))}
            </p>
          </div>
        </div>

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

function SmartBillCard({
  bill,
  memberId,
}: {
  bill: ISmartBill;
  memberId: string;
}) {
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

function mergeBills(data: IMemberBillDetail): ISmartBill[] {
  const billMap = new Map<string, ISmartBill>();
  for (const bill of data.billsPaid) {
    billMap.set(bill.billId, {
      billId: bill.billId,
      billName: bill.billName,
      totalAmount: bill.totalAmount,
      paidBy: bill.paidBy,
      paidByName: bill.paidByName,
      participantShares: [...bill.participantShares],
    });
  }

  for (const bill of data.billsUsed) {
    if (billMap.has(bill.billId)) {
      const existing = billMap.get(bill.billId)!;
      if (
        existing.participantShares.length === 0 &&
        bill.participantShares.length > 0
      ) {
        existing.participantShares = bill.participantShares;
      }
    } else {
      billMap.set(bill.billId, {
        billId: bill.billId,
        billName: bill.billName,
        totalAmount: bill.totalAmount,
        paidBy: bill.paidBy,
        paidByName: bill.paidByName,
        participantShares: bill.participantShares,
      });
    }
  }

  return Array.from(billMap.values());
}
