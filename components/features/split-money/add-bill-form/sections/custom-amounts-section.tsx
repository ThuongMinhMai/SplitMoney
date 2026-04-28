"use client";

import { FormLabel } from "@/components/ui/form";
import { MoneyInput } from "@/components/ui/money-input";
import { useI18n } from "@/context/i18n-context";
import type { BillFormValues } from "@/lib/validations";
import {
  AlertCircle,
  CheckCircle2,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Avatar } from "../../Avatar";
import type { IMember } from "../../types";
import { formatMoneyFull } from "../../utils";

interface ICustomAmountsSectionProps {
  members: IMember[];
}

export function CustomAmountsSection({ members }: ICustomAmountsSectionProps) {
  const { t } = useI18n();
  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<BillFormValues>();

  const splitType = watch("splitType");
  const participants = watch("participants");
  const totalAmount = watch("totalAmount");
  const customAmounts = watch("customAmounts") || {};

  if (splitType !== "custom" || participants.length === 0) return null;

  const currentTotalCustom = participants.reduce(
    (sum, pid) => sum + (customAmounts[pid] || 0),
    0,
  );

  const diffAmount = totalAmount - currentTotalCustom;
  const isCustomTotalValid = Math.abs(diffAmount) < 1;
  const isMissing = diffAmount > 0;

  // Xử lý lỗi từ Zod
  const rawError = (errors.customAmounts as any)?.message;
  const isAmountRequiredError = rawError === "bills.error.amountRequired";

  return (
    <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
      <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {t("bills.splitCustom")}
      </FormLabel>

      {/* Danh sách nhập liệu */}
      <div className="space-y-2">
        {participants.map((pid) => {
          const member = members.find((m) => m.id === pid);
          if (!member) return null;
          const val = customAmounts[pid] || 0;
          const hasError = isAmountRequiredError && val <= 0;

          return (
            <div
              key={pid}
              className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-2 w-32 shrink-0">
                <Avatar name={member.name} size="sm" />
                <span className="text-sm font-medium truncate">
                  {member.name}
                </span>
              </div>
              <div className="flex-1">
                <MoneyInput
                  placeholder="0"
                  className={`font-mono transition-all ${
                    hasError
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-emerald-500 border-border"
                  }`}
                  value={val}
                  onChange={(newVal) => {
                    setValue(`customAmounts.${pid}`, newVal, {
                      shouldDirty: true,
                    });
                    // Ép validate lại ngay lập tức để xóa lỗi khi nhập xong
                    trigger("customAmounts");
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Phần hiển thị Tổng & Chênh lệch */}
      {totalAmount > 0 && (
        <div className="space-y-2 pt-2 border-t border-dashed border-border">
          <div className="flex items-center gap-3 p-2">
            <div className="flex items-center gap-2 w-32 shrink-0">
              <div
                className={`h-8 w-8 flex items-center justify-center rounded-full transition-colors ${
                  isCustomTotalValid
                    ? "bg-emerald-100 dark:bg-emerald-900/30"
                    : "bg-red-100 dark:bg-red-900/30"
                }`}
              >
                {isCustomTotalValid ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <span
                className={`text-sm font-bold ${isCustomTotalValid ? "text-emerald-700" : "text-red-700"}`}
              >
                {t("bills.total")}
              </span>
            </div>
            <div className="flex-1">
              <div
                className={`h-10 px-3 flex items-center justify-start rounded-md border font-mono font-bold text-sm transition-all ${
                  isCustomTotalValid
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-600"
                }`}
              >
                {formatMoneyFull(currentTotalCustom)}
              </div>
            </div>
          </div>

          {/* Alert Thừa/Thiếu: Chỉ hiện khi đã nhập đủ các ô nhưng tổng chưa khớp */}
          {!isCustomTotalValid && !isAmountRequiredError && (
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-md border animate-in zoom-in-95 ${
                isMissing
                  ? "bg-amber-50 border-amber-200 text-amber-700"
                  : "bg-orange-50 border-orange-200 text-orange-700"
              }`}
            >
              {isMissing ? (
                <ArrowDownCircle className="h-4 w-4" />
              ) : (
                <ArrowUpCircle className="h-4 w-4" />
              )}
              <span className="text-xs font-semibold">
                {t(
                  isMissing
                    ? "bills.error.amountMissing"
                    : "bills.error.amountExcess",
                  {
                    amount: formatMoneyFull(Math.abs(diffAmount)),
                  },
                )}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Hiển thị lỗi text cuối cùng nếu có */}
      {rawError && (
        <div className="text-xs text-red-500 font-medium flex items-center gap-1.5 mt-2 animate-in fade-in slide-in-from-left-1">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>
            {rawError === "bills.error.totalDiff"
              ? t("bills.error.totalDiff", {
                  current: formatMoneyFull(currentTotalCustom),
                  total: formatMoneyFull(totalAmount),
                })
              : t(rawError)}
          </span>
        </div>
      )}
    </div>
  );
}
